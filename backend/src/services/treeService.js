import * as treeRepository from '../repositories/treeRepository.js';
import * as memberRepository from '../repositories/memberRepository.js';
import * as inviteRepository from '../repositories/inviteRepository.js';
import * as joinRequestRepository from '../repositories/joinRequestRepository.js';
import * as userRepository from '../repositories/userRepository.js';
import { logActivity } from './activityService.js';
import { createAndEmit } from './notificationService.js';
import { ACTIVITY_TYPES } from '../constants/index.js';
import { AppError, NotFoundError, ConflictError } from '../utils/errors.js';

async function getUserName(userId) {
  const user = await userRepository.findById(userId);
  return user?.displayName || user?.email || 'User';
}

export async function isTreeAdmin(userId, treeId) {
  const tree = await treeRepository.findById(treeId);
  if (tree && tree.ownerId === userId) {
    console.log('[AUTH] isTreeAdmin: user is tree owner', { userId, treeId, ownerId: tree.ownerId });
    return true;
  }

  const member = await memberRepository.findByTreeAndUser(treeId, userId);
  if (member && (member.role === 'Owner' || member.role === 'Admin')) {
    console.log('[AUTH] isTreeAdmin: user has admin membership', { userId, treeId, role: member.role });
    return true;
  }

  console.log('[AUTH] isTreeAdmin: denied', { userId, treeId, treeOwnerId: tree?.ownerId, memberRole: member?.role });
  return false;
}

export async function isTreeMember(userId, treeId) {
  const tree = await treeRepository.findById(treeId);
  if (tree && tree.ownerId === userId) return true;

  const member = await memberRepository.findByTreeAndUser(treeId, userId);
  return !!member;
}

export async function requireTreeAdmin(userId, treeId) {
  if (!(await isTreeAdmin(userId, treeId))) {
    throw new AppError('Only owners and admins can perform this action', 403);
  }
}

export async function requireTreeMember(userId, treeId) {
  if (!(await isTreeMember(userId, treeId))) {
    throw new AppError('Access denied. You are not a member of this tree.', 403);
  }
}

export async function createTree(userId, { name, clanName }) {
  const existingTrees = await treeRepository.findByOwnerId(userId);
  if (existingTrees.length > 0) {
    throw new ConflictError('User already owns a family tree. Each user can create only one tree.');
  }

  const code = await treeRepository.generateUniqueCode();

  let tree;
  try {
    tree = await treeRepository.create({
      name,
      code,
      ownerId: userId,
      clanName,
    });
  } catch (err) {
    if ((err.code === '23505' && err.constraint === 'uq_family_trees_owner')
        || (err.code === 'P2002' && err.meta?.target?.includes('owner_id'))) {
      throw new ConflictError('User already owns a family tree. Each user can create only one tree.');
    }
    throw err;
  }

  await memberRepository.addMember({
    treeId: tree.id,
    userId,
    role: 'Owner',
  });

  const userName = await getUserName(userId);
  await logActivity({
    treeId: tree.id,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.TREE_CREATED,
    entityType: 'TREE',
    entityId: tree.id,
    description: `${userName} created the family tree "${tree.name}"`,
    metadata: { treeName: tree.name, clanName: clanName || null },
  });

  return {
    id: tree.id,
    name: tree.name,
    code: tree.code,
    clanName: tree.clanName,
    ownerId: tree.ownerId,
    createdAt: tree.createdAt,
  };
}

export async function joinTree(userId, code) {
  const tree = await treeRepository.findByCode(code);
  if (!tree) throw new NotFoundError('Family tree code');

  if (!tree.isActive) {
    throw new AppError('This family tree is no longer active', 400);
  }

  const existingMember = await memberRepository.findByTreeAndUser(tree.id, userId);
  if (existingMember) {
    throw new ConflictError('You are already a member of this tree');
  }

  const existingRequest = await joinRequestRepository.findPending(tree.id, userId);
  if (existingRequest) {
    throw new AppError('You already have a pending request for this tree', 409);
  }

  await joinRequestRepository.create({
    treeId: tree.id,
    userId,
    code,
  });

  const userName = await getUserName(userId);
  await logActivity({
    treeId: tree.id,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.MEMBER_JOINED,
    entityType: 'MEMBER',
    entityId: userId,
    description: `${userName} requested to join "${tree.name}" via code`,
    metadata: { joinCode: code },
  });

  await createAndEmit({
    recipientUserId: tree.ownerId,
    actorUserId: userId,
    actorName: userName,
    type: 'info',
    title: 'Нэгдэх хүсэлт',
    message: `${userName} "${tree.name}" ургийн модонд нэгдэх хүсэлт илгээлээ.`,
    referenceType: 'join_request',
    referenceId: tree.id,
    treeId: tree.id,
    metadata: { requesterName: userName },
  });

  return {
    treeId: tree.id,
    treeName: tree.name,
    status: 'Pending',
  };
}

export async function getUserTrees(userId) {
  const trees = await treeRepository.findByMemberId(userId);
  const treeIds = trees.map((t) => t.id);

  const memberships = await Promise.all(
    treeIds.map((treeId) => memberRepository.findByTreeAndUser(treeId, userId))
  );

  const roleMap = new Map(
    memberships.filter(Boolean).map((m) => [m.treeId, m.role])
  );

  const mappedTrees = trees.map((t) => ({
    id: t.id,
    name: t.name,
    code: t.code,
    clanName: t.clanName,
    ownerId: t.ownerId,
    role: roleMap.get(t.id) || 'Viewer',
    createdAt: t.createdAt,
  }));

  const ownedTrees = mappedTrees.filter((t) => t.role === 'Owner');
  const sharedTrees = mappedTrees.filter((t) => t.role !== 'Owner');

  return { ownedTrees, sharedTrees };
}

export async function getTreeById(treeId, userId) {
  const tree = await treeRepository.findById(treeId);
  if (!tree) throw new NotFoundError('Family tree');

  await requireTreeMember(userId, treeId);

  const members = await memberRepository.findByTreeId(treeId);

  return {
    id: tree.id,
    name: tree.name,
    code: tree.code,
    clanName: tree.clanName,
    description: tree.description,
    privacySetting: tree.privacySetting,
    ownerId: tree.ownerId,
    isActive: tree.isActive,
    members: members.map((m) => ({
      id: m.id,
      userId: m.userId,
      email: m.user.email,
      username: m.user.username,
      firstName: m.user.firstName,
      lastName: m.user.lastName,
      displayName: m.user.displayName,
      avatar: m.user.avatarUrl,
      role: m.role,
      status: m.status,
      joinedAt: m.joinedAt,
    })),
    createdAt: tree.createdAt,
    updatedAt: tree.updatedAt,
  };
}

export async function updateTree(treeId, userId, fields) {
  const tree = await treeRepository.findById(treeId);
  if (!tree) throw new NotFoundError('Family tree');
  if (tree.ownerId !== userId) {
    throw new AppError('Only the tree owner can update the tree', 403);
  }

  const updated = await treeRepository.update(treeId, {
    name: fields.name,
    clanName: fields.clanName,
    description: fields.description,
    privacySetting: fields.privacySetting,
  });

  const userName = await getUserName(userId);
  await logActivity({
    treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.TREE_UPDATED,
    entityType: 'TREE',
    entityId: treeId,
    description: `${userName} updated the family tree "${updated.name}"`,
    metadata: { treeName: updated.name, changedFields: Object.keys(fields) },
  });

  return updated;
}

export async function deleteTree(treeId, userId) {
  const tree = await treeRepository.findById(treeId);
  if (!tree) throw new NotFoundError('Family tree');
  if (tree.ownerId !== userId) {
    throw new AppError('Only the tree owner can delete the tree', 403);
  }

  const userName = await getUserName(userId);
  await logActivity({
    treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.TREE_DELETED,
    entityType: 'TREE',
    entityId: treeId,
    description: `${userName} deleted the family tree "${tree.name}"`,
    metadata: { treeName: tree.name },
  });

  await treeRepository.deleteById(treeId);
}

export async function getTreeMembers(treeId, userId) {
  await requireTreeMember(userId, treeId);

  const members = await memberRepository.findByTreeId(treeId);
  return members.map((m) => ({
    id: m.id,
    userId: m.userId,
    email: m.user.email,
    username: m.user.username,
    firstName: m.user.firstName,
    lastName: m.user.lastName,
    displayName: m.user.displayName,
    avatar: m.user.avatarUrl,
    role: m.role,
    status: m.status,
    joinedAt: m.joinedAt,
  }));
}

export async function updateMemberRole(treeId, userId, targetUserId, role) {
  await requireTreeAdmin(userId, treeId);

  await memberRepository.updateRole(treeId, targetUserId, role);

  const userName = await getUserName(userId);
  const targetName = await getUserName(targetUserId);
  await logActivity({
    treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.ROLE_UPDATE,
    entityType: 'MEMBER',
    entityId: targetUserId,
    description: `${userName} changed ${targetName}'s role to ${role}`,
    metadata: { targetUserId, newRole: role },
  });

  await createAndEmit({
    recipientUserId: targetUserId,
    actorUserId: userId,
    actorName: userName,
    type: 'info',
    title: 'Эрх шинэчлэгдлээ',
    message: `Таны эрх "${role}" болж өөрчлөгдлөө.`,
    referenceType: 'member',
    referenceId: targetUserId,
    treeId,
  });
}

export async function removeMember(treeId, userId, targetUserId) {
  await requireTreeAdmin(userId, treeId);

  const tree = await treeRepository.findById(treeId);
  await memberRepository.removeMember(treeId, targetUserId);

  const userName = await getUserName(userId);
  const targetName = await getUserName(targetUserId);
  await logActivity({
    treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.MEMBER_REMOVED,
    entityType: 'MEMBER',
    entityId: targetUserId,
    description: `${userName} removed ${targetName} from the family tree`,
    metadata: { targetUserId },
  });

  await createAndEmit({
    recipientUserId: targetUserId,
    actorUserId: userId,
    actorName: userName,
    type: 'warn',
    title: 'Гишүүнээс хасагдлаа',
    message: `Та "${tree?.name || 'ургийн мод'}"-ны гишүүнээс хасагдлаа.`,
    referenceType: 'tree',
    referenceId: treeId,
    treeId,
  });
}

export async function getJoinRequests(treeId, userId) {
  await requireTreeAdmin(userId, treeId);

  const requests = await joinRequestRepository.findByTreeId(treeId);
  return requests.map((r) => ({
    id: r.id,
    treeId: r.treeId,
    userId: r.userId,
    username: r.user.username,
    displayName: r.user.displayName || r.user.username,
    avatar: r.user.avatarUrl,
    code: r.code,
    status: r.status,
    message: r.message,
    createdAt: r.createdAt,
  }));
}

export async function approveJoinRequest(treeId, requestId, userId) {
  await requireTreeAdmin(userId, treeId);

  const request = await joinRequestRepository.findById(requestId);
  if (!request || request.treeId !== treeId) {
    throw new NotFoundError('Join request');
  }

  if (request.status !== 'Pending') {
    throw new AppError(`Request is already ${request.status.toLowerCase()}`, 400);
  }

  const existingMember = await memberRepository.findByTreeAndUser(treeId, request.userId);
  if (!existingMember) {
    await memberRepository.addMember({
      treeId,
      userId: request.userId,
      role: 'Viewer',
      inviteCode: request.code,
    });
  }

  await joinRequestRepository.update(requestId, {
    status: 'Approved',
    reviewedBy: userId,
    reviewedAt: new Date(),
  });

  const userName = await getUserName(userId);
  const requestUserName = request.user?.displayName || request.user?.username || 'User';
  await logActivity({
    treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.MEMBER_APPROVED,
    entityType: 'MEMBER',
    entityId: request.userId,
    description: `${userName} approved ${requestUserName}'s request to join`,
    metadata: { targetUserId: request.userId, role: 'Viewer' },
  });

  const tree = await treeRepository.findById(treeId);
  await createAndEmit({
    recipientUserId: request.userId,
    actorUserId: userId,
    actorName: userName,
    type: 'success',
    title: 'Хүсэлт зөвшөөрөгдлөө',
    message: `Таны "${tree?.name || 'ургийн мод'}"-д нэгдэх хүсэлт зөвшөөрөгдлөө.`,
    referenceType: 'tree',
    referenceId: treeId,
    treeId,
  });

  return { status: 'Approved', treeId, userId: request.userId };
}

export async function rejectJoinRequest(treeId, requestId, userId) {
  await requireTreeAdmin(userId, treeId);

  const request = await joinRequestRepository.findById(requestId);
  if (!request || request.treeId !== treeId) {
    throw new NotFoundError('Join request');
  }

  if (request.status !== 'Pending') {
    throw new AppError(`Request is already ${request.status.toLowerCase()}`, 400);
  }

  await joinRequestRepository.update(requestId, {
    status: 'Rejected',
    reviewedBy: userId,
    reviewedAt: new Date(),
  });

  const userName = await getUserName(userId);
  const requestUserName = request.user?.displayName || request.user?.username || 'User';
  await logActivity({
    treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.MEMBER_REJECTED,
    entityType: 'MEMBER',
    entityId: request.userId,
    description: `${userName} rejected ${requestUserName}'s request to join`,
    metadata: { targetUserId: request.userId },
  });

  const tree = await treeRepository.findById(treeId);
  await createAndEmit({
    recipientUserId: request.userId,
    actorUserId: userId,
    actorName: userName,
    type: 'warn',
    title: 'Хүсэлт цуцлагдлаа',
    message: `Таны "${tree?.name || 'ургийн мод'}"-д нэгдэх хүсэлт цуцлагдлаа.`,
    referenceType: 'tree',
    referenceId: treeId,
    treeId,
  });

  return { status: 'Rejected' };
}

export async function getPendingJoinRequestsByOwner(userId) {
  const requests = await joinRequestRepository.findPendingByTreeOwner(userId);
  return requests.map((r) => ({
    id: r.id,
    treeId: r.treeId,
    treeName: r.tree?.name || 'Unknown Tree',
    treeCode: r.tree?.code || '',
    userId: r.userId,
    username: r.user?.username || 'Unknown',
    displayName: r.user?.displayName || r.user?.username || 'Unknown',
    avatar: r.user?.avatarUrl,
    code: r.code,
    status: r.status,
    message: r.message,
    createdAt: r.createdAt,
  }));
}

export async function addMember(treeId, userId, { userId: targetUserId, role }) {
  const tree = await treeRepository.findById(treeId);
  if (!tree) throw new NotFoundError('Family tree');

  if (!(await isTreeAdmin(userId, treeId))) {
    const member = await memberRepository.findByTreeAndUser(treeId, userId);
    if (!member || member.role !== 'Editor') {
      throw new AppError('Only owners, admins, and editors can invite members', 403);
    }
  }

  const targetUser = await userRepository.findById(targetUserId);
  if (!targetUser) throw new NotFoundError('User');

  const existingMembership = await memberRepository.findByTreeAndUser(treeId, targetUserId);
  if (existingMembership) throw new AppError('User is already a member of this tree', 409);

  await memberRepository.addMember({ treeId, userId: targetUserId, role });

  const userName = await getUserName(userId);
  const targetName = await getUserName(targetUserId);
  await logActivity({
    treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.MEMBER_JOINED,
    entityType: 'MEMBER',
    entityId: targetUserId,
    description: `${userName} added ${targetName} as ${role} to the family tree`,
    metadata: { targetUserId, role },
  });

  return { userId: targetUserId, role };
}

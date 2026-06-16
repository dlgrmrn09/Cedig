import * as inviteRepository from '../repositories/inviteRepository.js';
import * as memberRepository from '../repositories/memberRepository.js';
import * as treeRepository from '../repositories/treeRepository.js';
import * as userRepository from '../repositories/userRepository.js';
import { isTreeAdmin, isTreeMember, requireTreeAdmin, requireTreeMember } from './treeService.js';
import { logActivity } from './activityService.js';
import { ACTIVITY_TYPES } from '../constants/index.js';
import { AppError, NotFoundError } from '../utils/errors.js';

async function getUserName(userId) {
  const user = await userRepository.findById(userId);
  return user?.displayName || user?.email || 'User';
}

export async function createInvite(treeId, requestingUserId, { userId: targetUserId, role }) {
  const tree = await treeRepository.findById(treeId);
  if (!tree) throw new NotFoundError('Family tree');

  if (!(await isTreeAdmin(requestingUserId, treeId))) {
    const member = await memberRepository.findByTreeAndUser(treeId, requestingUserId);
    if (!member || member.role !== 'Editor') {
      throw new AppError('Only owners, admins, and editors can invite members', 403);
    }
  }

  const targetUser = await userRepository.findById(targetUserId);
  if (!targetUser) throw new NotFoundError('User');

  const existingMember = await memberRepository.findByTreeAndUser(treeId, targetUserId);
  if (existingMember) throw new AppError('User is already a member of this tree', 409);

  const existingInvite = await inviteRepository.findByTreeAndUser(treeId, targetUserId);
  if (existingInvite && existingInvite.status === 'Pending') {
    throw new AppError('An invite for this user is already pending', 409);
  }

  const codePrefix = role === 'Editor' ? 'EDIT' : 'VIEW';
  const code = `${codePrefix}-${Math.floor(Math.random() * 900 + 100)}`;

  const invite = await inviteRepository.create({
    treeId,
    userId: targetUserId,
    role,
    code,
    invitedBy: requestingUserId,
  });

  return {
    id: invite.id,
    userId: invite.userId,
    role: invite.role,
    code: invite.code,
    status: invite.status,
    username: targetUser.username,
    displayName: targetUser.displayName || targetUser.username,
    avatar: targetUser.avatarUrl,
  };
}

export async function getInvites(treeId, userId) {
  await requireTreeMember(userId, treeId);

  const invites = await inviteRepository.findByTreeId(treeId);
  return invites.map((inv) => ({
    id: inv.id,
    userId: inv.userId,
    role: inv.role,
    code: inv.code,
    status: inv.status,
    user: inv.user ? {
      username: inv.user.username,
      displayName: inv.user.displayName,
      avatar: inv.user.avatarUrl,
    } : null,
  }));
}

export async function updateInviteRole(inviteId, treeId, userId, role) {
  await requireTreeAdmin(userId, treeId);

  const invite = await inviteRepository.findById(inviteId);
  if (!invite || invite.treeId !== treeId) {
    throw new NotFoundError('Invite');
  }

  const updated = await inviteRepository.update(inviteId, { role });
  return { id: updated.id, userId: updated.userId, role: updated.role };
}

export async function removeInvite(inviteId, treeId, userId) {
  await requireTreeAdmin(userId, treeId);

  const invite = await inviteRepository.findById(inviteId);
  if (!invite || invite.treeId !== treeId) {
    throw new NotFoundError('Invite');
  }

  await inviteRepository.deleteById(inviteId);
}

export async function getUserInvites(userId) {
  const invites = await inviteRepository.findByUserId(userId);
  return invites.map((inv) => ({
    id: inv.id,
    treeId: inv.treeId,
    treeName: inv.tree?.name || 'Unknown Tree',
    treeCode: inv.tree?.code || '',
    role: inv.role,
    status: inv.status,
    code: inv.code,
    invitedBy: inv.inviter ? {
      id: inv.inviter.id,
      displayName: inv.inviter.displayName || inv.inviter.username,
      username: inv.inviter.username,
      avatar: inv.inviter.avatarUrl,
    } : null,
    createdAt: inv.createdAt,
  }));
}

export async function acceptInvite(inviteId, userId) {
  const invite = await inviteRepository.findById(inviteId);
  if (!invite) throw new NotFoundError('Invite');

  if (invite.userId !== userId) {
    throw new AppError('This invitation is not for you', 403);
  }

  if (invite.status !== 'Pending') {
    throw new AppError(`Invitation is already ${invite.status.toLowerCase()}`, 400);
  }

  const existingMember = await memberRepository.findByTreeAndUser(invite.treeId, userId);
  if (existingMember) {
    await inviteRepository.update(inviteId, { status: 'Accepted' });
    throw new AppError('You are already a member of this tree', 409);
  }

  await memberRepository.addMember({
    treeId: invite.treeId,
    userId,
    role: invite.role,
    inviteCode: invite.code,
  });

  await inviteRepository.update(inviteId, { status: 'Accepted' });

  const userName = await getUserName(userId);
  await logActivity({
    treeId: invite.treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.MEMBER_JOINED,
    entityType: 'MEMBER',
    entityId: userId,
    description: `${userName} accepted invitation to join as ${invite.role}`,
    metadata: { role: invite.role, inviteCode: invite.code },
  });

  return {
    treeId: invite.treeId,
    role: invite.role,
  };
}

export async function declineInvite(inviteId, userId) {
  const invite = await inviteRepository.findById(inviteId);
  if (!invite) throw new NotFoundError('Invite');

  if (invite.userId !== userId) {
    throw new AppError('This invitation is not for you', 403);
  }

  if (invite.status !== 'Pending') {
    throw new AppError(`Invitation is already ${invite.status.toLowerCase()}`, 400);
  }

  await inviteRepository.update(inviteId, { status: 'Declined' });

  const userName = await getUserName(userId);
  await logActivity({
    treeId: invite.treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.MEMBER_REJECTED,
    entityType: 'MEMBER',
    entityId: userId,
    description: `${userName} declined invitation to join`,
    metadata: { role: invite.role },
  });

  return { status: 'Declined' };
}

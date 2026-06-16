import * as personRepository from '../repositories/personRepository.js';
import * as treeRepository from '../repositories/treeRepository.js';
import * as memberRepository from '../repositories/memberRepository.js';
import { requireTreeMember, requireTreeAdmin, isTreeAdmin, isTreeMember } from './treeService.js';
import { logActivity } from './activityService.js';
import { createAndEmit } from './notificationService.js';
import { ACTIVITY_TYPES } from '../constants/index.js';
import { NotFoundError, AppError } from '../utils/errors.js';

export async function getPeople(treeId, userId, options = {}) {
  await requireTreeMember(userId, treeId);
  return personRepository.findByTreeId(treeId, options);
}

export async function getPersonById(personId, treeId, userId) {
  await requireTreeMember(userId, treeId);
  const person = await personRepository.findById(personId);
  if (!person || person.treeId !== treeId) throw new NotFoundError('Person');
  return person;
}

export async function createPerson(treeId, userId, data) {
  const isMember = await isTreeMember(userId, treeId);
  if (!isMember) throw new AppError('Access denied. You are not a member of this tree.', 403);

  const member = await memberRepository.findByTreeAndUser(treeId, userId);
  const role = member?.role || (await treeRepository.findById(treeId))?.ownerId === userId ? 'Owner' : 'Viewer';
  if (role === 'Viewer') throw new AppError('Viewers cannot create people', 403);

  const pendingOralHistory = (data.notes || '').toLowerCase().includes('oral');

  const person = await personRepository.create({
    ...data,
    treeId,
    createdBy: userId,
    verified: false,
    pendingOralHistory,
  });

  const user = await getUserById(userId);
  const userName = user?.displayName || user?.email || 'User';

  if (data.spouseId) {
    await personRepository.update(data.spouseId, { spouseId: person.id });
  }
  if (data.fatherId || data.motherId) {
    await personRepository.update(person.id, { relationshipLabel: 'DIRECT LINE' });
  }

  await logActivity({
    treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.PERSON_CREATED,
    entityType: 'PERSON',
    entityId: person.id,
    description: `${userName} added ${person.firstName} ${person.lastName} (${person.birthYear})`,
    metadata: { personName: `${person.firstName} ${person.lastName}`, birthYear: person.birthYear },
  });

  const tree = await treeRepository.findById(treeId);
  if (tree && tree.ownerId !== userId) {
    const ownerUser = await getUserById(tree.ownerId);
    await createAndEmit({
      recipientUserId: tree.ownerId,
      actorUserId: userId,
      actorName: userName,
      type: 'info',
      title: 'New Family Member Added',
      message: `${userName} added ${person.firstName} ${person.lastName} to the family tree.`,
      referenceType: 'person',
      referenceId: person.id,
      treeId,
      metadata: { personName: `${person.firstName} ${person.lastName}` },
    });
  }

  return { person };
}

export async function updatePerson(personId, treeId, userId, updates) {
  const isMember = await isTreeMember(userId, treeId);
  if (!isMember) throw new AppError('Access denied. You are not a member of this tree.', 403);

  const member = await memberRepository.findByTreeAndUser(treeId, userId);
  const role = member?.role || 'Owner';
  if (role === 'Viewer') throw new AppError('Viewers cannot edit people', 403);

  const person = await personRepository.findById(personId);
  if (!person || person.treeId !== treeId) throw new NotFoundError('Person');

  const updated = await personRepository.update(personId, updates);

  const user = await getUserById(userId);
  const userName = user?.displayName || user?.email || 'User';

  await logActivity({
    treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.PERSON_UPDATED,
    entityType: 'PERSON',
    entityId: person.id,
    description: `${userName} updated ${person.firstName} ${person.lastName}`,
    metadata: { personName: `${person.firstName} ${person.lastName}` },
  });

  return updated;
}

export async function deletePerson(personId, treeId, userId) {
  await requireTreeAdmin(userId, treeId);

  const person = await personRepository.findById(personId);
  if (!person || person.treeId !== treeId) throw new NotFoundError('Person');

  const user = await getUserById(userId);
  const userName = user?.displayName || user?.email || 'User';

  await logActivity({
    treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: ACTIVITY_TYPES.PERSON_DELETED,
    entityType: 'PERSON',
    entityId: person.id,
    description: `${userName} deleted ${person.firstName} ${person.lastName}`,
    metadata: { personName: `${person.firstName} ${person.lastName}` },
  });

  const tree = await treeRepository.findById(treeId);
  if (tree && tree.ownerId !== userId) {
    const ownerUser = await getUserById(tree.ownerId);
    await createAndEmit({
      recipientUserId: tree.ownerId,
      actorUserId: userId,
      actorName: userName,
      type: 'warn',
      title: 'Family Member Deleted',
      message: `${userName} deleted ${person.firstName} ${person.lastName} from the family tree.`,
      referenceType: 'person',
      referenceId: person.id,
      treeId,
      metadata: { personName: `${person.firstName} ${person.lastName}` },
    });
  }

  await personRepository.deleteById(personId);
}

async function getUserById(userId) {
  const { findById } = await import('../repositories/userRepository.js');
  return findById(userId);
}

import * as activityRepository from '../repositories/activityRepository.js';
import { requireTreeMember } from './treeService.js';

export async function getActivities(treeId, userId, options = {}) {
  await requireTreeMember(userId, treeId);

  return activityRepository.findByTreeId(treeId, options);
}

export async function logActivity({
  treeId,
  actorUserId,
  actorName,
  activityType,
  entityType,
  entityId,
  description,
  metadata,
}) {
  return activityRepository.create({
    treeId,
    type: activityType,
    description,
    personId: entityType === 'PERSON' ? entityId : null,
    userId: actorUserId,
    userName: actorName || 'System',
    metadata: metadata || {},
  });
}

import * as mediaRepository from '../repositories/mediaRepository.js';
import * as personRepository from '../repositories/personRepository.js';
import * as memberRepository from '../repositories/memberRepository.js';
import * as userRepository from '../repositories/userRepository.js';
import * as treeRepository from '../repositories/treeRepository.js';
import { requireTreeMember, requireTreeAdmin, isTreeMember } from './treeService.js';
import { logActivity } from './activityService.js';
import { ACTIVITY_TYPES } from '../constants/index.js';
import { NotFoundError, AppError } from '../utils/errors.js';
import { uploadFile, deleteFile } from '../lib/s3.js';

async function getUserName(userId) {
  const user = await userRepository.findById(userId);
  return user?.displayName || user?.email || 'User';
}

export async function getMediaByPerson(personId, treeId, userId) {
  await requireTreeMember(userId, treeId);
  return mediaRepository.findByPersonId(personId);
}

export async function getMediaByTree(treeId, userId, options = {}) {
  await requireTreeMember(userId, treeId);
  return mediaRepository.findByTreeId(treeId, options);
}

export async function createMedia(treeId, userId, data, file = null) {
  const isMember = await isTreeMember(userId, treeId);
  if (!isMember) throw new AppError('Access denied. You are not a member of this tree.', 403);

  const member = await memberRepository.findByTreeAndUser(treeId, userId);
  const role = member?.role || 'Owner';
  if (role === 'Viewer') throw new AppError('Viewers cannot upload media', 403);

  const person = await personRepository.findById(data.personId);
  if (!person || person.treeId !== treeId) throw new NotFoundError('Person');

  let url = data.url;
  let fileKey = null;
  let fileSize = null;
  let mimeType = null;

  if (file) {
    const uploadResult = await uploadFile(file, `trees/${treeId}/people/${data.personId}`);
    url = uploadResult.url;
    fileKey = uploadResult.key;
    fileSize = file.size;
    mimeType = file.mimetype;
  }

  const media = await mediaRepository.create({
    personId: data.personId,
    treeId,
    title: data.title,
    description: data.description || '',
    type: data.type,
    url,
    fileKey,
    fileSize,
    mimeType,
    uploadedBy: userId,
  });

  const userName = await getUserName(userId);
  const isPhoto = data.type === 'photo';
  await logActivity({
    treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: isPhoto ? ACTIVITY_TYPES.PHOTO_UPLOADED : ACTIVITY_TYPES.DOCUMENT_UPLOADED,
    entityType: 'MEDIA',
    entityId: media.id,
    description: `${userName} uploaded ${isPhoto ? 'photo' : 'document'} "${data.title}" for ${person.firstName} ${person.lastName}`,
    metadata: { mediaId: media.id, title: data.title, type: data.type, personId: data.personId, personName: `${person.firstName} ${person.lastName}` },
  });

  return media;
}

export async function deleteMedia(mediaId, treeId, userId) {
  await requireTreeAdmin(userId, treeId);

  const media = await mediaRepository.findById(mediaId);
  if (!media || media.treeId !== treeId) throw new NotFoundError('Media');

  if (media.fileKey) {
    await deleteFile(media.fileKey).catch(() => {});
  }

  await mediaRepository.deleteById(mediaId);

  const userName = await getUserName(userId);
  const isPhoto = media.type === 'photo';
  await logActivity({
    treeId,
    actorUserId: userId,
    actorName: userName,
    activityType: isPhoto ? ACTIVITY_TYPES.PHOTO_DELETED : ACTIVITY_TYPES.DOCUMENT_DELETED,
    entityType: 'MEDIA',
    entityId: mediaId,
    description: `${userName} deleted ${isPhoto ? 'photo' : 'document'} "${media.title}"`,
    metadata: { mediaId, title: media.title, type: media.type },
  });
}

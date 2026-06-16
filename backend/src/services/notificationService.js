import * as notificationRepository from '../repositories/notificationRepository.js';
import { emitToUser } from '../sockets/index.js';
import { NotFoundError } from '../utils/errors.js';

export async function getNotifications(userId, options = {}) {
  return notificationRepository.findByUserId(userId, options);
}

export async function getUnreadCount(userId) {
  return notificationRepository.getUnreadCount(userId);
}

export async function markAsRead(notificationId, userId) {
  const notification = await notificationRepository.markAsRead(notificationId, userId);
  if (!notification) throw new NotFoundError('Notification');
  return notification;
}

export async function markAllAsRead(userId) {
  await notificationRepository.markAllAsRead(userId);
}

export async function clearAll(userId) {
  await notificationRepository.clearAll(userId);
}

export async function createAndEmit({
  recipientUserId,
  actorUserId,
  actorName,
  type,
  title,
  message,
  referenceType,
  referenceId,
  treeId,
  metadata,
}) {
  const notification = await notificationRepository.create({
    userId: recipientUserId,
    type,
    title,
    message,
    referenceType: referenceType || null,
    referenceId: referenceId || null,
  });

  const payload = {
    id: notification.id,
    type,
    title,
    message,
    isRead: false,
    referenceType: referenceType || null,
    referenceId: referenceId || null,
    treeId: treeId || null,
    actorName: actorName || null,
    createdAt: notification.createdAt,
  };

  emitToUser(recipientUserId, 'notification:new', payload);

  return notification;
}

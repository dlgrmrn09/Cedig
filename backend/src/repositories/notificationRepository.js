import prisma from '../config/prisma.js';

export async function findById(id) {
  return prisma.notification.findUnique({ where: { id } });
}

export async function findByUserId(userId, options = {}) {
  const { page, limit } = options;
  const pg = Math.max(1, parseInt(page) || 1);
  const lim = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const skip = (pg - 1) * lim;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: lim,
      skip,
    }),
    prisma.notification.count({ where: { userId } }),
  ]);

  return { notifications, total, page: pg, limit: lim };
}

export async function getUnreadCount(userId) {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

export async function create({ userId, type, title, message, referenceType, referenceId }) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      referenceType: referenceType || null,
      referenceId: referenceId || null,
    },
  });
}

export async function markAsRead(id, userId) {
  return prisma.notification.update({
    where: { id, userId },
    data: { isRead: true },
  });
}

export async function markAllAsRead(userId) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function clearAll(userId) {
  await prisma.notification.deleteMany({ where: { userId } });
}

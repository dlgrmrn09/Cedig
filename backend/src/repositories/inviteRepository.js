import prisma from '../config/prisma.js';

export async function findById(id) {
  return prisma.invite.findUnique({
    where: { id },
    include: { user: { select: { username: true, displayName: true, avatarUrl: true } } },
  });
}

export async function findByTreeId(treeId) {
  return prisma.invite.findMany({
    where: { treeId },
    include: { user: { select: { username: true, displayName: true, avatarUrl: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findByTreeAndUser(treeId, userId) {
  return prisma.invite.findFirst({
    where: { treeId, userId },
  });
}

export async function findByCode(code) {
  return prisma.invite.findUnique({ where: { code } });
}

export async function create({ treeId, userId, role, code, invitedBy, email, phone }) {
  return prisma.invite.create({
    data: {
      treeId,
      userId,
      email: email || null,
      phone: phone || null,
      role,
      code,
      invitedBy: invitedBy || null,
    },
  });
}

export async function update(id, fields) {
  if (Object.keys(fields).length === 0) return findById(id);

  return prisma.invite.update({
    where: { id },
    data: { ...fields, updatedAt: new Date() },
  });
}

export async function deleteById(id) {
  await prisma.invite.delete({ where: { id } });
}

export async function findByUserId(userId) {
  return prisma.invite.findMany({
    where: { userId, status: 'Pending' },
    include: {
      tree: { select: { id: true, name: true, code: true } },
      inviter: { select: { id: true, displayName: true, username: true, avatarUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

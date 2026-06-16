import prisma from '../config/prisma.js';

export async function findById(id) {
  return prisma.treeMember.findUnique({ where: { id } });
}

export async function findByTreeAndUser(treeId, userId) {
  return prisma.treeMember.findFirst({
    where: { treeId, userId },
  });
}

export async function findByTreeId(treeId) {
  return prisma.treeMember.findMany({
    where: { treeId },
    include: {
      user: {
        select: {
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatarUrl: true,
          role: true,
        },
      },
    },
    orderBy: { joinedAt: 'asc' },
  });
}

export async function addMember({ treeId, userId, role, inviteCode }) {
  const existing = await prisma.treeMember.findFirst({
    where: { treeId, userId },
  });

  if (existing) {
    return prisma.treeMember.update({
      where: { id: existing.id },
      data: { role, status: 'Active' },
    });
  }

  return prisma.treeMember.create({
    data: {
      treeId,
      userId,
      role,
      inviteCode: inviteCode || null,
    },
  });
}

export async function updateRole(treeId, userId, role) {
  await prisma.treeMember.updateMany({
    where: { treeId, userId },
    data: { role },
  });
}

export async function removeMember(treeId, userId) {
  await prisma.treeMember.deleteMany({
    where: { treeId, userId },
  });
}

export async function countByTreeId(treeId) {
  return prisma.treeMember.count({ where: { treeId } });
}

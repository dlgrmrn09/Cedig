import prisma from '../config/prisma.js';

export async function findById(id) {
  return prisma.joinRequest.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      tree: { select: { id: true, name: true, code: true } },
    },
  });
}

export async function findByTreeId(treeId) {
  return prisma.joinRequest.findMany({
    where: { treeId },
    include: {
      user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findPending(treeId, userId) {
  return prisma.joinRequest.findFirst({
    where: { treeId, userId, status: 'Pending' },
  });
}

export async function create({ treeId, userId, code, message }) {
  return prisma.joinRequest.create({
    data: { treeId, userId, code, message: message || null },
  });
}

export async function findPendingByTreeOwner(userId) {
  const ownedTrees = await prisma.familyTree.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });

  const adminTrees = await prisma.treeMember.findMany({
    where: { userId, role: 'Admin' },
    select: { treeId: true },
  });

  const treeIds = [
    ...ownedTrees.map((t) => t.id),
    ...adminTrees.map((m) => m.treeId),
  ];

  if (treeIds.length === 0) return [];

  return prisma.joinRequest.findMany({
    where: {
      treeId: { in: treeIds },
      status: 'Pending',
    },
    include: {
      user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      tree: { select: { id: true, name: true, code: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function update(id, fields) {
  return prisma.joinRequest.update({
    where: { id },
    data: { ...fields, updatedAt: new Date() },
  });
}

import prisma from '../config/prisma.js';

export async function findById(id) {
  return prisma.familyTree.findUnique({ where: { id } });
}

export async function findByCode(code) {
  return prisma.familyTree.findUnique({ where: { code } });
}

export async function findByOwnerId(ownerId) {
  return prisma.familyTree.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findByMemberId(userId) {
  return prisma.familyTree.findMany({
    where: {
      members: { some: { userId } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function create({ name, code, ownerId, clanName, description }) {
  return prisma.familyTree.create({
    data: {
      name,
      code,
      ownerId,
      clanName: clanName || null,
      description: description || null,
    },
  });
}

export async function update(id, fields) {
  if (Object.keys(fields).length === 0) return findById(id);

  return prisma.familyTree.update({
    where: { id },
    data: { ...fields, updatedAt: new Date() },
  });
}

export async function deleteById(id) {
  await prisma.familyTree.delete({ where: { id } });
}

export async function generateUniqueCode() {
  const prefix = 'CEDIG-';
  const num = Math.floor(Math.random() * 90000 + 10000);
  const code = `${prefix}${num}`;
  const existing = await findByCode(code);
  if (existing) return generateUniqueCode();
  return code;
}

export async function countTrees() {
  return prisma.familyTree.count();
}

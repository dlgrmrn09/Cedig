import prisma from '../config/prisma.js';

export async function findById(id) {
  return prisma.media.findUnique({ where: { id } });
}

export async function findByPersonId(personId) {
  return prisma.media.findMany({
    where: { personId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findByTreeId(treeId, options = {}) {
  const { page, limit } = options;
  const pg = Math.max(1, parseInt(page) || 1);
  const lim = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const skip = (pg - 1) * lim;

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where: { treeId },
      orderBy: { createdAt: 'desc' },
      take: lim,
      skip,
    }),
    prisma.media.count({ where: { treeId } }),
  ]);

  return { media, total, page: pg, limit: lim };
}

export async function create(data) {
  return prisma.media.create({
    data: {
      personId: data.personId,
      treeId: data.treeId,
      title: data.title,
      description: data.description || '',
      type: data.type,
      url: data.url,
      fileKey: data.fileKey || null,
      fileSize: data.fileSize || null,
      mimeType: data.mimeType || null,
      version: data.version || 1,
      uploadedBy: data.uploadedBy || null,
    },
  });
}

export async function update(id, fields) {
  if (Object.keys(fields).length === 0) return findById(id);

  return prisma.media.update({
    where: { id },
    data: { ...fields, updatedAt: new Date() },
  });
}

export async function deleteById(id) {
  await prisma.media.delete({ where: { id } });
}

export async function countByTreeId(treeId) {
  return prisma.media.count({ where: { treeId } });
}

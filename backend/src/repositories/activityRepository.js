import prisma from '../config/prisma.js';

export async function findByTreeId(treeId, options = {}) {
  const { search, page, limit, type, from, to } = options;
  const pg = Math.max(1, parseInt(page) || 1);
  const lim = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const skip = (pg - 1) * lim;

  const where = { treeId };

  if (type) {
    if (type === 'create') {
      where.type = { in: ['person_created', 'tree_created', 'relationship_created', 'member_approved', 'photo_uploaded', 'document_uploaded'] };
    } else if (type === 'edit') {
      where.type = { in: ['person_updated', 'tree_updated', 'relationship_updated'] };
    } else if (type === 'delete') {
      where.type = { in: ['person_deleted', 'tree_deleted', 'relationship_deleted', 'photo_deleted', 'document_deleted'] };
    }
  }

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }

  if (search) {
    const term = search.trim();
    const searchClauses = [
      { description: { contains: term, mode: 'insensitive' } },
      { userName: { contains: term, mode: 'insensitive' } },
    ];
    if (where.OR) {
      where.AND = [{ OR: where.OR }, { OR: searchClauses }];
      delete where.OR;
    } else {
      where.OR = searchClauses;
    }
  }

  const [activities, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: lim,
      skip,
      include: {
        user: { select: { id: true, displayName: true, avatarUrl: true, username: true } },
      },
    }),
    prisma.activityLog.count({ where }),
  ]);

  return { activities, total, page: pg, limit: lim };
}

export async function create({ treeId, type, description, personId, userId, userName, metadata }) {
  return prisma.activityLog.create({
    data: {
      treeId,
      type,
      description,
      personId: personId || null,
      userId: userId || null,
      userName: userName || 'System',
      metadata: metadata || {},
    },
  });
}

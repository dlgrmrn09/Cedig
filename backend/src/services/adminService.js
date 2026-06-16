import prisma from '../config/prisma.js';

export async function getAdminStats() {
  const [userCount, treeCount, mediaCount, personCount] = await Promise.all([
    prisma.user.count(),
    prisma.familyTree.count(),
    prisma.media.count(),
    prisma.person.count(),
  ]);

  const trees = await prisma.familyTree.findMany({
    select: {
      clanName: true,
      _count: { select: { media: true } },
      media: { select: { fileSize: true } },
    },
  });

  const revenueResult = await prisma.subscription.aggregate({
    where: { status: 'active' },
    _count: true,
    _sum: { amount: true },
  });

  return {
    totalUsers: userCount,
    totalTrees: treeCount,
    totalMedia: mediaCount,
    totalPeople: personCount,
    storageByClan: trees.map((t) => ({
      clanName: t.clanName || 'Unknown',
      mediaCount: t._count.media,
      totalBytes: t.media.reduce((sum, m) => sum + (m.fileSize || 0), 0),
    })),
    totalRevenue: Number(revenueResult._sum.amount || 0),
    totalSubscriptions: revenueResult._count,
    systemStatus: 'healthy',
    sslActive: true,
  };
}

import prisma from '../config/prisma.js';

export async function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function findByFirebaseUid(uid) {
  return prisma.user.findUnique({ where: { firebaseUid: uid } });
}

export async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findByPhone(phone) {
  return prisma.user.findUnique({ where: { phone } });
}

export async function findByUsername(username) {
  return prisma.user.findUnique({ where: { username } });
}

export async function createFromFirebase({ firebaseUid, email, displayName, avatarUrl, phone, emailVerified }) {
  const username = email ? email.split('@')[0] : `user_${Date.now()}`;
  const firstName = displayName?.split(' ')[0] || '';
  const lastName = displayName?.split(' ').slice(1).join(' ') || '';

  return prisma.user.upsert({
    where: { firebaseUid },
    update: {
      email,
      displayName,
      avatarUrl,
      lastLoginAt: new Date(),
    },
    create: {
      firebaseUid,
      email,
      username,
      firstName,
      lastName,
      displayName,
      avatarUrl,
      phone,
      role: 'Owner',
      emailVerified: emailVerified === true,
    },
  });
}

export async function create({ email, password, username, firstName, lastName, phone, countryCode }) {
  return prisma.user.create({
    data: {
      email,
      passwordHash: password || null,
      username,
      firstName,
      lastName,
      phone: phone || null,
      countryCode: countryCode || '+976',
      role: 'Owner',
      emailVerified: false,
    },
  });
}

export async function update(id, fields) {
  if (Object.keys(fields).length === 0) return findById(id);

  return prisma.user.update({
    where: { id },
    data: { ...fields, updatedAt: new Date() },
  });
}

export async function updateLastLogin(id) {
  await prisma.user.update({
    where: { id },
    data: { lastLoginAt: new Date() },
  });
}

export async function searchByEmail(email) {
  return prisma.user.findMany({
    where: {
      email: { contains: email, mode: 'insensitive' },
    },
  });
}

export async function searchByUsername(query) {
  return prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { displayName: { contains: query, mode: 'insensitive' } },
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
    },
    take: 10,
  });
}

export async function deleteById(id) {
  await prisma.user.delete({ where: { id } });
}

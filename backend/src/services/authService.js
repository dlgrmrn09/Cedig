import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/index.js';
import prisma from '../config/prisma.js';
import * as userRepository from '../repositories/userRepository.js';
import * as treeRepository from '../repositories/treeRepository.js';
import * as memberRepository from '../repositories/memberRepository.js';
import { AppError, UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors.js';
import { normalizeUsername } from '../utils/username.js';

const SALT_ROUNDS = 12;

async function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, uid: user.firebaseUid, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
}

function formatUserResponse(user) {
  return {
    id: user.id,
    name: user.displayName || `${user.firstName} ${user.lastName}`.trim() || user.email,
    email: user.email,
    username: user.username,
    role: user.role,
    avatar: user.avatarUrl,
    code: null,
  };
}

export async function loginWithEmail({ email, password }) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash || '');
  if (!isValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const tokens = await generateTokens(user);
  return { ...tokens, user: formatUserResponse(user) };
}

export async function loginWithPhone({ phone, countryCode, password }) {
  const fullPhone = `${countryCode}${phone}`;
  const user = await userRepository.findByPhone(fullPhone);
  if (!user) {
    throw new UnauthorizedError('Invalid phone or password');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash || '');
  if (!isValid) {
    throw new UnauthorizedError('Invalid phone or password');
  }

  const tokens = await generateTokens(result);
  return { ...tokens, user: formatUserResponse(result) };
}

export async function registerWithEmail(data) {
  const existingEmail = await userRepository.findByEmail(data.email);
  if (existingEmail) {
    throw new ConflictError('Email already registered');
  }

  const normalizedUsername = normalizeUsername(data.username);
  const existingUsername = await userRepository.findByUsername(normalizedUsername);
  if (existingUsername) {
    throw new ConflictError('Username already taken');
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await userRepository.create({
    email: data.email,
    password: passwordHash,
    username: normalizedUsername,
    firstName: data.firstName,
    lastName: data.lastName,
  });

  await userRepository.update(user.id, { passwordHash });

  const treeCode = await treeRepository.generateUniqueCode();

  let tree;
  try {
    tree = await treeRepository.create({
      name: `${data.firstName}'s Family Tree`,
      code: treeCode,
      ownerId: user.id,
    });
  } catch (err) {
    if ((err.code === '23505' && err.constraint === 'uq_family_trees_owner')
        || (err.code === 'P2002' && err.meta?.target?.includes('owner_id'))) {
      const existingTrees = await treeRepository.findByOwnerId(user.id);
      tree = existingTrees[0];
    } else {
      throw err;
    }
  }

  await memberRepository.addMember({
    treeId: tree.id,
    userId: user.id,
    role: 'Owner',
  });

  const tokens = await generateTokens(user);
  return {
    ...tokens,
    user: formatUserResponse(user),
    familyTree: {
      code: tree.code,
      name: tree.name,
      id: tree.id,
    },
  };
}

export async function registerWithPhone(data) {
  const fullPhone = `${data.countryCode}${data.phone}`;

  const normalizedUsername = normalizeUsername(data.username);
  const existingUsername = await userRepository.findByUsername(normalizedUsername);
  if (existingUsername) {
    throw new ConflictError('Username already taken');
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await userRepository.create({
    email: null,
    password: passwordHash,
    username: normalizedUsername,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: fullPhone,
    countryCode: data.countryCode,
  });

  await userRepository.update(user.id, { passwordHash });

  const treeCode = await treeRepository.generateUniqueCode();

  let tree;
  try {
    tree = await treeRepository.create({
      name: `${data.firstName}'s Family Tree`,
      code: treeCode,
      ownerId: user.id,
    });
  } catch (err) {
    if ((err.code === '23505' && err.constraint === 'uq_family_trees_owner')
        || (err.code === 'P2002' && err.meta?.target?.includes('owner_id'))) {
      const existingTrees = await treeRepository.findByOwnerId(user.id);
      tree = existingTrees[0];
    } else {
      throw err;
    }
  }

  await memberRepository.addMember({
    treeId: tree.id,
    userId: user.id,
    role: 'Owner',
  });

  const tokens = await generateTokens(user);
  return {
    ...tokens,
    user: formatUserResponse(user),
    familyTree: {
      code: tree.code,
      name: tree.name,
      id: tree.id,
    },
  };
}

export async function handleSocialLogin({ idToken, provider }) {
  const { OAuth2Client } = await import('google-auth-library');
  const client = new OAuth2Client(config.firebase.projectId);

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: config.firebase.projectId,
    });
    payload = ticket.getPayload();
  } catch (err) {
    throw new UnauthorizedError('Invalid social login token');
  }

  const { sub, email, name, picture } = payload;

  let user = await userRepository.findByFirebaseUid(sub);
  if (!user) {
    user = await userRepository.createFromFirebase({
      firebaseUid: sub,
      email: email || '',
      displayName: name || email?.split('@')[0] || 'User',
      avatarUrl: picture || null,
    });
  }

  const tokens = await generateTokens(user);
  return { ...tokens, user: formatUserResponse(user) };
}

export async function forgotPassword(email) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    return { message: 'If the email exists, a reset link has been sent.' };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const token = uuidv4();

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      email,
      token,
      otp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: false,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    });

    await transporter.sendMail({
      from: config.emailFrom,
      to: email,
      subject: 'CEDIG - Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. Valid for 15 minutes.`,
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>Valid for 15 minutes.</p>`,
    });
  } catch (err) {
    console.warn('Failed to send email:', err.message);
  }

  return { message: 'OTP sent to your email', token };
}

export async function verifyOtp({ email, otp }) {
  const result = await prisma.passwordResetToken.findFirst({
    where: {
      email,
      otp,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!result) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  return { verified: true, token: result.token };
}

export async function resetPassword({ email, password, token }) {
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      email,
      token,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!resetToken) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await userRepository.update(resetToken.userId, { passwordHash });
  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { used: true },
  });

  return { message: 'Password reset successful' };
}

export async function resendOtp(email) {
  return forgotPassword(email);
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const userRow = await userRepository.findById(userId);
  if (!userRow) throw new NotFoundError('User');

  const storedHash = userRow.passwordHash;
  if (storedHash) {
    const isValid = await bcrypt.compare(currentPassword, storedHash);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 400);
    }
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await userRepository.update(userId, { passwordHash });

  return { message: 'Password changed successfully' };
}

export async function refreshToken(refreshTokenStr) {
  try {
    const decoded = jwt.verify(refreshTokenStr, config.jwt.secret);
    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const tokens = await generateTokens(user);
    return { ...tokens, user: formatUserResponse(user) };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
}


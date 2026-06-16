import * as userRepository from '../repositories/userRepository.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { normalizeUsername } from '../utils/username.js';

export async function getProfile(userId) {
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError('User');

  return {
    id: user.id,
    name: user.displayName || `${user.firstName} ${user.lastName}`.trim() || user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatarUrl,
    phone: user.phone,
    countryCode: user.countryCode,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    authMethod: user.authMethod,
  };
}

export async function updateProfile(userId, { firstName, lastName, username }) {
  const normalizedUsername = normalizeUsername(username);
  const existing = await userRepository.findByUsername(normalizedUsername);
  if (existing && existing.id !== userId) {
    throw new ConflictError('Username already taken');
  }

  const user = await userRepository.update(userId, {
    firstName,
    lastName,
    username: normalizedUsername,
    displayName: `${firstName} ${lastName}`.trim(),
  });

  return {
    id: user.id,
    name: user.displayName,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
  };
}

export async function updateEmail(userId, email) {
  const existing = await userRepository.findByEmail(email);
  if (existing && existing.id !== userId) {
    throw new ConflictError('Email already in use');
  }

  const user = await userRepository.update(userId, { email, emailVerified: false });
  return { email: user.email, emailVerified: user.emailVerified };
}

export async function confirmEmailVerified(userId) {
  const user = await userRepository.update(userId, { emailVerified: true });
  return { email: user.email, emailVerified: user.emailVerified };
}

export async function updatePhone(userId, phone, countryCode) {
  const user = await userRepository.update(userId, {
    phone,
    countryCode,
    phoneVerified: true,
  });
  return { phone: user.phone, countryCode: user.countryCode, phoneVerified: user.phoneVerified };
}

export async function deleteAccount(userId) {
  await userRepository.deleteById(userId);
}

export async function searchUsers(query, requestingUserId) {
  if (!query || query.length < 2) return [];
  const users = await userRepository.searchByUsername(query.trim());
  return users
    .filter((u) => u.id !== requestingUserId)
    .map((u) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName || u.username,
      avatar: u.avatarUrl,
    }));
}

export async function checkUsernameAvailability(username) {
  if (!username || username.length < 3) return false;
  const normalized = username.trim().toLowerCase();
  const existing = await userRepository.findByUsername(normalized);
  return !existing;
}

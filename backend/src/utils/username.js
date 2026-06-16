export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export const RESERVED_USERNAMES = new Set([
  'admin', 'root', 'system', 'support',
  'api', 'settings', 'login', 'register',
  'logout', 'signup', 'signin', 'auth',
  'dashboard', 'account', 'profile',
  'password', 'security', 'billing',
  'help', 'contact', 'about', 'terms',
  'privacy', 'legal', 'status', 'health',
  'moderator', 'mod', 'owner', 'admin_cedig',
  'administrator', 'superuser', 'super',
  'null', 'undefined', 'anonymous', 'guest',
  'test', 'testing', 'user', 'users',
]);

export function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return 'Username is required';
  }

  const trimmed = username.trim().toLowerCase();

  if (trimmed.length < 3) {
    return 'Username must be at least 3 characters';
  }

  if (trimmed.length > 30) {
    return 'Username must be at most 30 characters';
  }

  if (!USERNAME_REGEX.test(trimmed)) {
    return 'Username can only contain letters, numbers, and underscores';
  }

  if (RESERVED_USERNAMES.has(trimmed)) {
    return 'This username is reserved';
  }

  return null;
}

export function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

export function generateUsername(displayName, email) {
  let base = '';

  if (displayName && displayName.trim()) {
    base = displayName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  }

  if (!base && email) {
    base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
  }

  if (!base) {
    base = 'user';
  }

  if (base.length > 30) {
    base = base.slice(0, 30).replace(/_$/, '');
  }

  if (base.length < 3) {
    base = base.padEnd(3, '0');
  }

  if (RESERVED_USERNAMES.has(base)) {
    base = base + '_1';
  }

  return base;
}

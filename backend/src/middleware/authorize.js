import { AppError } from '../utils/errors.js';
import { USER_ROLES } from '../constants/index.js';

const ROLE_HIERARCHY = {
  [USER_ROLES.OWNER]: 4,
  [USER_ROLES.ADMIN]: 3,
  [USER_ROLES.EDITOR]: 2,
  [USER_ROLES.VIEWER]: 1,
};

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        errors: [],
      });
    }

    const userRole = req.user.role;
    const userLevel = ROLE_HIERARCHY[userRole] || 0;

    const hasAccess = allowedRoles.some((role) => {
      const requiredLevel = ROLE_HIERARCHY[role] || 0;
      return userLevel >= requiredLevel;
    });

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${userRole}`,
        errors: [],
      });
    }

    next();
  };
}

export function isOwner(req, res, next) {
  if (req.user && req.user.role === USER_ROLES.OWNER) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Only the tree owner can perform this action.',
    errors: [],
  });
}

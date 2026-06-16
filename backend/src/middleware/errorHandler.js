import { AppError } from '../utils/errors.js';
import config from '../config/index.js';

export function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
      errors: [],
    });
  }

  if (err.code === '23505' || err.code === 'P2002') {
    const target = err.meta?.target || err.constraint || '';
    const field = target.includes('owner') || target.includes('owner_id') ? 'tree ownership' : 'record';
    return res.status(409).json({
      success: false,
      message: `A ${field} already exists for this user.`,
      errors: [],
    });
  }

  console.error('Unhandled error:', err);

  return res.status(500).json({
    success: false,
    message: config.nodeEnv === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error',
    errors: [],
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    errors: [],
  });
}

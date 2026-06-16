import asyncHandler from 'express-async-handler';
import { uploadFile } from '../lib/s3.js';
import { successResponse } from '../utils/response.js';
import { UPLOAD } from '../constants/index.js';
import { AppError } from '../utils/errors.js';

export const uploadFileHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file provided', 400);
  }

  const file = req.file;
  const folder = req.body.folder || 'uploads';

  console.log('[UPLOAD START]', {
    userId: req.user?.id,
    fileName: file.originalname,
    fileSize: file.size,
    mimeType: file.mimetype,
    folder,
  });

  if (!UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    console.log('[UPLOAD FAILED] Invalid MIME type', { mimeType: file.mimetype });
    throw new AppError(`File type ${file.mimetype} is not allowed`, 400);
  }

  const result = await uploadFile(file, folder);

  console.log('[UPLOAD SUCCESS]', {
    url: result.url,
    key: result.key,
    fileName: file.originalname,
  });

  successResponse(res, {
    url: result.url,
    key: result.key,
    fileName: file.originalname,
    fileSize: file.size,
    mimeType: file.mimetype,
  }, 201);
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file provided', 400);
  }

  const result = await uploadFile(req.file, 'avatars');

  const { update } = await import('../repositories/userRepository.js');
  await update(req.user.id, { avatarUrl: result.url });

  successResponse(res, { avatarUrl: result.url }, 201);
});

export const deleteAvatar = asyncHandler(async (req, res) => {
  const { update } = await import('../repositories/userRepository.js');
  await update(req.user.id, { avatarUrl: null });
  successResponse(res, { avatarUrl: null });
});

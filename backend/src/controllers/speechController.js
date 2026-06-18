import asyncHandler from 'express-async-handler';
import { successResponse } from '../utils/response.js';
import * as speechService from '../services/speechService.js';

export const transcribe = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.buffer || req.file.size === 0) {
    return res.status(400).json({
      success: false,
      message: 'No audio file provided',
      errors: [],
    });
  }

  const result = await speechService.transcribeAudio(req.file.buffer);

  successResponse(res, result);
});

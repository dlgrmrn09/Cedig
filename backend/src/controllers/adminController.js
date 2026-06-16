import asyncHandler from 'express-async-handler';
import * as adminService from '../services/adminService.js';
import { successResponse } from '../utils/response.js';

export const getAdminStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getAdminStats();
  successResponse(res, stats);
});

import asyncHandler from 'express-async-handler';
import * as activityService from '../services/activityService.js';
import { successWithPagination } from '../utils/response.js';

export const getActivities = asyncHandler(async (req, res) => {
  console.log('[DATA] GET /activity/:treeId', { treeId: req.params.treeId, userId: req.user?.id });
  const result = await activityService.getActivities(req.params.treeId, req.user.id, req.query);
  successWithPagination(res, result.activities, {
    currentPage: result.page,
    totalPages: Math.ceil(result.total / result.limit),
    totalItems: result.total,
    pageSize: result.limit,
  });
});

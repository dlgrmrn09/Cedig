import asyncHandler from 'express-async-handler';
import * as notificationService from '../services/notificationService.js';
import { successResponse, successWithPagination, messageResponse } from '../utils/response.js';

export const getNotifications = asyncHandler(async (req, res) => {
  console.log('[DATA] GET /notifications', { userId: req.user?.id });
  const result = await notificationService.getNotifications(req.user.id, req.query);
  successWithPagination(res, result.notifications, {
    currentPage: result.page,
    totalPages: Math.ceil(result.total / result.limit),
    totalItems: result.total,
    pageSize: result.limit,
  });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id);
  successResponse(res, { unreadCount: count });
});

export const markAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAsRead(req.params.id, req.user.id);
  messageResponse(res, 'Notification marked as read');
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  messageResponse(res, 'All notifications marked as read');
});

export const clearAll = asyncHandler(async (req, res) => {
  await notificationService.clearAll(req.user.id);
  messageResponse(res, 'All notifications cleared');
});

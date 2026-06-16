import asyncHandler from 'express-async-handler';
import * as userService from '../services/userService.js';
import * as authService from '../services/authService.js';
import { successResponse, messageResponse } from '../utils/response.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user.id);
  successResponse(res, profile);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const result = await userService.updateProfile(req.user.id, req.body);
  successResponse(res, result);
});

export const updateEmail = asyncHandler(async (req, res) => {
  const result = await userService.updateEmail(req.user.id, req.body.email);
  successResponse(res, { ...result, message: 'Verification email sent to new address. Email will update after verification.' });
});

export const updatePhone = asyncHandler(async (req, res) => {
  const result = await userService.updatePhone(req.user.id, req.body.phone, req.body.countryCode);
  successResponse(res, result);
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  messageResponse(res, 'Password changed successfully');
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await userService.deleteAccount(req.user.id);
  messageResponse(res, 'Account deleted successfully');
});

export const updateNotificationPreferences = asyncHandler(async (req, res) => {
  messageResponse(res, 'Notification preferences updated');
});

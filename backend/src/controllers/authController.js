import asyncHandler from 'express-async-handler';
import * as authService from '../services/authService.js';
import { successResponse } from '../utils/response.js';

export const loginWithEmail = asyncHandler(async (req, res) => {
  console.log('[AUTH] LOGIN EMAIL REQUEST RECEIVED', { email: req.body.email });
  const result = await authService.loginWithEmail(req.body);
  console.log('[AUTH] LOGIN EMAIL SUCCESS', { email: req.body.email, userId: result.user?.id });
  successResponse(res, result);
});

export const loginWithPhone = asyncHandler(async (req, res) => {
  console.log('[AUTH] LOGIN PHONE REQUEST RECEIVED');
  const result = await authService.loginWithPhone(req.body);
  console.log('[AUTH] LOGIN PHONE SUCCESS');
  successResponse(res, result);
});

export const registerWithEmail = asyncHandler(async (req, res) => {
  console.log('[AUTH] REGISTER REQUEST RECEIVED', { email: req.body.email, username: req.body.username });
  const result = await authService.registerWithEmail(req.body);
  console.log('[AUTH] REGISTER SUCCESS - USER CREATED', { userId: result.user?.id, treeCode: result.familyTree?.code });
  successResponse(res, result, 201);
});

export const registerWithPhone = asyncHandler(async (req, res) => {
  console.log('[AUTH] REGISTER PHONE REQUEST RECEIVED');
  const result = await authService.registerWithPhone(req.body);
  console.log('[AUTH] REGISTER PHONE SUCCESS - USER CREATED');
  successResponse(res, result, 201);
});

export const socialLogin = asyncHandler(async (req, res) => {
  console.log('[AUTH] SOCIAL LOGIN REQUEST RECEIVED', { provider: req.body.provider });
  const result = await authService.handleSocialLogin(req.body);
  console.log('[AUTH] SOCIAL LOGIN SUCCESS', { userId: result.user?.id });
  successResponse(res, result);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  console.log('[AUTH] FORGOT PASSWORD REQUEST RECEIVED', { email: req.body.email });
  const result = await authService.forgotPassword(req.body.email);
  successResponse(res, result);
});

export const verifyOtp = asyncHandler(async (req, res) => {
  console.log('[AUTH] VERIFY OTP REQUEST RECEIVED');
  const result = await authService.verifyOtp(req.body);
  successResponse(res, result);
});

export const resetPassword = asyncHandler(async (req, res) => {
  console.log('[AUTH] RESET PASSWORD REQUEST RECEIVED');
  const result = await authService.resetPassword(req.body);
  successResponse(res, result);
});

export const resendOtp = asyncHandler(async (req, res) => {
  console.log('[AUTH] RESEND OTP REQUEST RECEIVED');
  const result = await authService.resendOtp(req.body.email);
  successResponse(res, result);
});

export const refreshToken = asyncHandler(async (req, res) => {
  console.log('[AUTH] REFRESH TOKEN REQUEST RECEIVED');
  const result = await authService.refreshToken(req.body.refreshToken);
  successResponse(res, result);
});

export const getMe = asyncHandler(async (req, res) => {
  console.log('[AUTH] GET ME REQUEST RECEIVED', { userId: req.user?.id });
  const { getProfile } = await import('../services/userService.js');
  const { getUserTrees } = await import('../services/treeService.js');

  const [profile, treesData] = await Promise.all([
    getProfile(req.user.id),
    getUserTrees(req.user.id).catch(() => ({ ownedTrees: [], sharedTrees: [] })),
  ]);

  successResponse(res, { ...profile, ...treesData });
});

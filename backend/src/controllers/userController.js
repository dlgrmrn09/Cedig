import asyncHandler from 'express-async-handler';
import * as userService from '../services/userService.js';
import { successResponse } from '../utils/response.js';

export const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const users = await userService.searchUsers(query, req.user.id);
  successResponse(res, users);
});

export const checkUsername = asyncHandler(async (req, res) => {
  const { username } = req.query;
  const available = await userService.checkUsernameAvailability(username);
  successResponse(res, { available });
});

import asyncHandler from 'express-async-handler';
import * as inviteService from '../services/inviteService.js';
import { successResponse, messageResponse } from '../utils/response.js';

export const createInvite = asyncHandler(async (req, res) => {
  const invite = await inviteService.createInvite(
    req.params.treeId,
    req.user.id,
    req.body
  );
  successResponse(res, invite, 201);
});

export const getInvites = asyncHandler(async (req, res) => {
  const invites = await inviteService.getInvites(req.params.treeId, req.user.id);
  successResponse(res, invites);
});

export const getUserInvites = asyncHandler(async (req, res) => {
  const invites = await inviteService.getUserInvites(req.user.id);
  successResponse(res, invites);
});

export const updateInviteRole = asyncHandler(async (req, res) => {
  const result = await inviteService.updateInviteRole(
    req.params.inviteId,
    req.params.treeId,
    req.user.id,
    req.body.role
  );
  successResponse(res, result);
});

export const removeInvite = asyncHandler(async (req, res) => {
  await inviteService.removeInvite(
    req.params.inviteId,
    req.params.treeId,
    req.user.id
  );
  messageResponse(res, 'Invite removed successfully');
});

export const acceptInvite = asyncHandler(async (req, res) => {
  const result = await inviteService.acceptInvite(req.params.inviteId, req.user.id);
  successResponse(res, result);
});

export const declineInvite = asyncHandler(async (req, res) => {
  const result = await inviteService.declineInvite(req.params.inviteId, req.user.id);
  successResponse(res, result);
});

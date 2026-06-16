import asyncHandler from 'express-async-handler';
import * as treeService from '../services/treeService.js';
import { successResponse, messageResponse } from '../utils/response.js';

export const createTree = asyncHandler(async (req, res) => {
  const tree = await treeService.createTree(req.user.id, req.body);
  successResponse(res, {
    familyTreeCode: tree.code,
    familyTreeName: tree.name,
    ...tree,
  }, 201);
});

export const joinTree = asyncHandler(async (req, res) => {
  const result = await treeService.joinTree(req.user.id, req.body.code);
  successResponse(res, { ...result, message: 'Join request submitted. Awaiting owner approval.' }, 201);
});

export const getUserTrees = asyncHandler(async (req, res) => {
  console.log('[DATA] GET /trees', { userId: req.user?.id });
  const trees = await treeService.getUserTrees(req.user.id);
  successResponse(res, trees);
});

export const getTreeById = asyncHandler(async (req, res) => {
  const tree = await treeService.getTreeById(req.params.id, req.user.id);
  successResponse(res, tree);
});

export const updateTree = asyncHandler(async (req, res) => {
  const tree = await treeService.updateTree(req.params.id, req.user.id, req.body);
  successResponse(res, tree);
});

export const deleteTree = asyncHandler(async (req, res) => {
  await treeService.deleteTree(req.params.id, req.user.id);
  messageResponse(res, 'Family tree deleted successfully');
});

export const getMembers = asyncHandler(async (req, res) => {
  const members = await treeService.getTreeMembers(req.params.id, req.user.id);
  successResponse(res, members);
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const { targetUserId, role } = req.body;
  await treeService.updateMemberRole(req.params.id, req.user.id, targetUserId, role);
  messageResponse(res, 'Member role updated');
});

export const removeMember = asyncHandler(async (req, res) => {
  await treeService.removeMember(req.params.id, req.user.id, req.params.memberId);
  messageResponse(res, 'Member removed successfully');
});

export const getJoinRequests = asyncHandler(async (req, res) => {
  const requests = await treeService.getJoinRequests(req.params.id, req.user.id);
  successResponse(res, requests);
});

export const approveJoinRequest = asyncHandler(async (req, res) => {
  console.log('[DATA] APPROVE JOIN REQUEST', {
    treeId: req.params.id,
    requestId: req.params.requestId,
    userId: req.user.id,
  });
  const result = await treeService.approveJoinRequest(req.params.id, req.params.requestId, req.user.id);
  successResponse(res, { ...result, message: 'Join request approved. User is now a member.' });
});

export const rejectJoinRequest = asyncHandler(async (req, res) => {
  console.log('[DATA] REJECT JOIN REQUEST', {
    treeId: req.params.id,
    requestId: req.params.requestId,
    userId: req.user.id,
  });
  const result = await treeService.rejectJoinRequest(req.params.id, req.params.requestId, req.user.id);
  successResponse(res, { ...result, message: 'Join request rejected.' });
});

export const getPendingJoinRequests = asyncHandler(async (req, res) => {
  const requests = await treeService.getPendingJoinRequestsByOwner(req.user.id);
  successResponse(res, requests);
});

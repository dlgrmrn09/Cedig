import asyncHandler from 'express-async-handler';
import * as mediaService from '../services/mediaService.js';
import { successResponse, successWithPagination, messageResponse } from '../utils/response.js';

export const getMediaByPerson = asyncHandler(async (req, res) => {
  const treeId = req.query.treeId || req.body?.treeId;
  const media = await mediaService.getMediaByPerson(
    req.params.personId,
    treeId,
    req.user.id
  );
  successResponse(res, media);
});

export const getMediaByTree = asyncHandler(async (req, res) => {
  console.log('[DATA] GET /media/tree/:treeId', { treeId: req.params.treeId, userId: req.user?.id });
  const result = await mediaService.getMediaByTree(req.params.treeId, req.user.id, req.query);
  successWithPagination(res, result.media, {
    currentPage: result.page,
    totalPages: Math.ceil(result.total / result.limit),
    totalItems: result.total,
    pageSize: result.limit,
  });
});

export const createMedia = asyncHandler(async (req, res) => {
  console.log('[MEDIA] POST /media', {
    userId: req.user?.id,
    treeId: req.body.treeId,
    personId: req.body.personId,
    title: req.body.title,
    type: req.body.type,
    hasFile: !!req.file,
    fileName: req.file?.originalname,
    fileSize: req.file?.size,
  });
  const media = await mediaService.createMedia(
    req.body.treeId,
    req.user.id,
    req.body,
    req.file || null
  );
  console.log('[MEDIA SUCCESS]', { mediaId: media.id, url: media.url });
  successResponse(res, media, 201);
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const treeId = req.query.treeId || req.body?.treeId;
  await mediaService.deleteMedia(req.params.id, treeId, req.user.id);
  messageResponse(res, 'Media deleted successfully');
});

import { Router } from 'express';
import * as treeController from '../controllers/treeController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { createTreeSchema, joinTreeSchema, updateTreeSchema, treeIdParamSchema } from '../validators/trees.js';
import { USER_ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createTreeSchema), treeController.createTree);
router.post('/join', validate(joinTreeSchema), treeController.joinTree);
router.get('/', treeController.getUserTrees);

// Pending join requests for all trees owned/admin by current user (must come before /:id)
router.get('/join-requests/pending', treeController.getPendingJoinRequests);

router.get('/:id', treeController.getTreeById);
router.put('/:id', validate(updateTreeSchema), treeController.updateTree);
router.delete('/:id', authorize(USER_ROLES.OWNER), treeController.deleteTree);

router.get('/:id/members', treeController.getMembers);
router.put('/:id/members/role', treeController.updateMemberRole);
router.delete('/:id/members/:memberId', treeController.removeMember);

// Join requests (owner/admin review)
router.get('/:id/join-requests', treeController.getJoinRequests);
router.post('/:id/join-requests/:requestId/approve', treeController.approveJoinRequest);
router.post('/:id/join-requests/:requestId/reject', treeController.rejectJoinRequest);

export default router;

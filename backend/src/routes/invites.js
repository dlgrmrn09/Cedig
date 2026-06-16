import { Router } from 'express';
import * as inviteController from '../controllers/inviteController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createInviteSchema, updateInviteRoleSchema, inviteParamSchema } from '../validators/invites.js';

const router = Router();

router.use(authenticate);

// User-facing: my pending invites
router.get('/user', inviteController.getUserInvites);

// Accept / decline invites (for invited user)
router.post('/:inviteId/accept', inviteController.acceptInvite);
router.post('/:inviteId/decline', inviteController.declineInvite);

// Tree admin: manage invites for a specific tree
router.get('/tree/:treeId', inviteController.getInvites);
router.post('/tree/:treeId', validate(createInviteSchema), inviteController.createInvite);
router.put('/tree/:treeId/:inviteId', validate(updateInviteRoleSchema), inviteController.updateInviteRole);
router.delete('/tree/:treeId/:inviteId', inviteController.removeInvite);

export default router;

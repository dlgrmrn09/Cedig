import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { USER_ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate);
router.use(authorize(USER_ROLES.OWNER, USER_ROLES.ADMIN));

router.get('/stats', adminController.getAdminStats);

export default router;

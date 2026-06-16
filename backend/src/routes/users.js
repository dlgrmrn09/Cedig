import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/search', userController.searchUsers);
router.get('/check-username', userController.checkUsername);

export default router;

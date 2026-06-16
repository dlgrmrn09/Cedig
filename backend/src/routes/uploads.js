import { Router } from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { authenticate } from '../middleware/authenticate.js';
import { uploadSingle, uploadMultiple, uploadAvatar } from '../storage/upload.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticate);
router.use(uploadLimiter);

router.post('/file', uploadSingle, uploadController.uploadFileHandler);
router.post('/avatar', uploadAvatar, uploadController.uploadAvatar);
router.delete('/avatar', uploadController.deleteAvatar);
router.post('/multiple', uploadMultiple, uploadController.uploadFileHandler);

export default router;

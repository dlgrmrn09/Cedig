import { Router } from 'express';
import * as mediaController from '../controllers/mediaController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createMediaSchema, updateMediaSchema } from '../validators/media.js';
import { uploadSingle } from '../storage/upload.js';

const router = Router();

router.use(authenticate);

router.get('/person/:personId', mediaController.getMediaByPerson);
router.get('/tree/:treeId', mediaController.getMediaByTree);
router.post('/', uploadSingle, validate(createMediaSchema), mediaController.createMedia);
router.delete('/:id', mediaController.deleteMedia);

export default router;

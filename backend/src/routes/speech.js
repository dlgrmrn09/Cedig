import { Router } from 'express';
import multer from 'multer';
import * as speechController from '../controllers/speechController.js';
import { authenticate } from '../middleware/authenticate.js';

const audioUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/wav',
      'audio/wave',
      'audio/x-wav',
      'audio/mp4',
      'audio/mpeg',
      'audio/ogg',
      'audio/opus',
      'application/octet-stream',
    ];
    if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error(`Audio file type ${file.mimetype} is not allowed`), false);
    }
  },
});

const router = Router();

router.use(authenticate);
router.post('/', audioUpload.single('audio'), speechController.transcribe);

export default router;

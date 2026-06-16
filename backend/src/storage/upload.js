import multer from 'multer';
import { UPLOAD } from '../constants/index.js';

const storage = multer.memoryStorage();

const AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const AVATAR_MAX_SIZE = 5 * 1024 * 1024; // 5MB

const fileFilter = (req, file, cb) => {
  if (UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Accepted: ${UPLOAD.ALLOWED_MIME_TYPES.join(', ')}`), false);
  }
};

const avatarFilter = (req, file, cb) => {
  if (AVATAR_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed for avatars. Accepted: ${AVATAR_MIME_TYPES.join(', ')}`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE,
    files: 10,
  },
});

const avatarUpload = multer({
  storage,
  fileFilter: avatarFilter,
  limits: {
    fileSize: AVATAR_MAX_SIZE,
    files: 1,
  },
});

export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.array('files', 10);
export const uploadAvatar = avatarUpload.single('file');

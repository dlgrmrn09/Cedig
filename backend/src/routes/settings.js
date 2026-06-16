import { Router } from 'express';
import * as settingsController from '../controllers/settingsController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import {
  updateProfileSchema,
  updateEmailSchema,
  updatePhoneSchema,
  changePasswordSchema,
  notificationPreferenceSchema,
} from '../validators/settings.js';

const router = Router();

router.use(authenticate);

router.get('/profile', settingsController.getProfile);
router.put('/profile', validate(updateProfileSchema), settingsController.updateProfile);
router.put('/email', validate(updateEmailSchema), settingsController.updateEmail);
router.put('/phone', validate(updatePhoneSchema), settingsController.updatePhone);
router.put('/password', validate(changePasswordSchema), settingsController.changePassword);
router.put('/notifications', validate(notificationPreferenceSchema), settingsController.updateNotificationPreferences);
router.delete('/account', settingsController.deleteAccount);

export default router;

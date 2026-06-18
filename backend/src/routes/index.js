import { Router } from 'express';
import authRoutes from './auth.js';
import treeRoutes from './trees.js';
import personRoutes from './people.js';
import mediaRoutes from './media.js';
import inviteRoutes from './invites.js';
import notificationRoutes from './notifications.js';
import activityRoutes from './activity.js';
import settingsRoutes from './settings.js';
import adminRoutes from './admin.js';
import uploadRoutes from './uploads.js';
import userRoutes from './users.js';
import speechRoutes from './speech.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/trees', treeRoutes);
router.use('/people', personRoutes);
router.use('/media', mediaRoutes);
router.use('/invites', inviteRoutes);
router.use('/notifications', notificationRoutes);
router.use('/activity', activityRoutes);
router.use('/settings', settingsRoutes);
router.use('/admin', adminRoutes);
router.use('/uploads', uploadRoutes);
router.use('/users', userRoutes);
router.use('/speech-to-text', speechRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'CEDIG API is running', timestamp: new Date().toISOString() });
});

export default router;

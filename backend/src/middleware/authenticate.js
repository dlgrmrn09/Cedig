import admin from '../lib/firebase.js';
import * as userRepository from '../repositories/userRepository.js';
import { AppError } from '../utils/errors.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
      console.log('[AUTH] TOKEN VERIFIED', { uid: decodedToken.uid, email: decodedToken.email });
    } catch (err) {
      if (err.code === 'auth/id-token-expired') {
        throw new AppError('Token expired. Please refresh your session.', 401);
      }
      throw new AppError('Invalid authentication token.', 401);
    }

    const { uid, email, name, picture, phone_number, email_verified } = decodedToken;

    console.log('[AUTH] TOKEN CLAIMS', { uid, email, email_verified });

    let user = await userRepository.findByFirebaseUid(uid);

    if (!user) {
      user = await userRepository.createFromFirebase({
        firebaseUid: uid,
        email: email || '',
        displayName: name || email?.split('@')[0] || 'User',
        avatarUrl: picture || null,
        phone: phone_number || null,
        emailVerified: email_verified === true,
      });
      console.log('[AUTH] USER CREATED FROM FIREBASE', { userId: user.id, email: user.email });
    } else {
      if (email_verified === true && !user.emailVerified) {
        await userRepository.update(user.id, { emailVerified: true });
        user.emailVerified = true;
        console.log('[AUTH] Email verified flag synced from Firebase', { userId: user.id, email: user.email });
      }
    }

    await userRepository.updateLastLogin(user.id);
    console.log('[AUTH] USER AUTHENTICATED', { userId: user.id, role: user.role });

    req.user = {
      id: user.id,
      firebaseUid: uid,
      email: user.email || email || '',
      username: user.username,
      firstName: user.firstName || user.first_name || '',
      lastName: user.lastName || user.last_name || '',
      displayName: user.displayName || user.display_name || '',
      role: user.role,
      avatar: user.avatarUrl || user.avatar_url || null,
      phone: user.phone,
      emailVerified: user.emailVerified || user.email_verified || false,
      phoneVerified: user.phoneVerified || user.phone_verified || false,
    };

    next();
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errors: [],
      });
    }
    console.error('Auth middleware error:', err);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.',
      errors: [],
    });
  }
}

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import VerifyEmailPage from './VerifyEmailPage';
import ResetPasswordSentPage from './ResetPasswordSentPage';
import OTPVerificationPage from './OTPVerificationPage';
import ResetPasswordPage from './ResetPasswordPage';
import SuccessPage from './SuccessPage';
import { useAppStore } from '@/src/store';

import type { ViewType } from '@/src/types/common';

export function AuthScreenContent({ initialViewMode }: { initialViewMode?: ViewType }) {
  const { currentView } = useAppStore((state) => state);

  // Seed the store view on mount, then use store-driven view thereafter
  React.useEffect(() => {
    if (initialViewMode) {
      useAppStore.setState({ currentView: initialViewMode });
    }
  }, [initialViewMode]);

  const viewToShow = currentView;

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const renderPage = () => {
    switch (viewToShow) {
      case 'login':
        return <LoginPage key="login" />;
      case 'register':
        return <RegisterPage key="register" />;
      case 'forgot-password':
        return <ForgotPasswordPage key="forgot" />;
      case 'reset-password-sent':
        return <ResetPasswordSentPage key="reset-sent" />;
      case 'verify-email':
        return <VerifyEmailPage key="verify-email" />;
      case 'otp-verification':
        return <OTPVerificationPage key="otp" />;
      case 'reset-password':
        return <ResetPasswordPage key="reset" />;
      case 'auth-success':
        return <SuccessPage key="success" />;
      default:
        return <LoginPage key="login-default" />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewToShow}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
      >
        {renderPage()}
      </motion.div>
    </AnimatePresence>
  );
}

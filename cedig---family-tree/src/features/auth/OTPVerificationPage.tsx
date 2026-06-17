'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import AuthLayout from '@/src/components/AuthLayout';
import OTPForm from '@/src/components/forms/OTPForm';
import { useAppStore } from '@/src/store';
import { useRecaptcha } from '@/src/hooks/useRecaptcha';
import { ShieldCheck } from 'lucide-react';

export default function OTPVerificationPage() {
  const router = useRouter();
  const { emailSentTo, authMethod, otpCountdown, verifyOtp, resendOtp } = useAppStore();
  const { executeRecaptcha, isConfigured } = useRecaptcha();

  const isEmail = authMethod === 'email';

  const handleVerifyOtp = async (otp: string) => {
    if (isConfigured) {
      await executeRecaptcha('verify_otp');
    }
    verifyOtp(emailSentTo ?? '', otp);
  };

  const handleResendOtp = async () => {
    if (isConfigured) {
      const token = await executeRecaptcha('resend_otp');
      resendOtp(emailSentTo ?? '', token);
    } else {
      resendOtp(emailSentTo ?? '');
    }
  };

  const handleChangeDestination = () => {
    router.push('/forgot-password');
  };

  return (
    <AuthLayout
      hero={
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-bronze" />
            </div>
            <h1 className="text-3xl font-bold leading-tight text-white">
              Баталгаажуулалт<br />
              хийх шаардлагатай
            </h1>
            <p className="text-base text-white/60 leading-relaxed max-w-md">
              Таны аюулгүй байдлыг хангах үүднээс
              баталгаажуулах код илгээлээ.
            </p>
          </div>
          <div className="space-y-2 text-sm text-white/50">
            <div className="flex items-center gap-2 text-white/60">
              <div className="w-1.5 h-1.5 rounded-full bg-bronze" />
              Код 2 минутын дотор хүчинтэй
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <div className="w-1.5 h-1.5 rounded-full bg-bronze" />
              Ирээгүй бол дахин илгээнэ үү
            </div>
          </div>
        </motion.div>
      }
      form={
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-8 sm:p-10">
          <OTPForm
            onSubmit={handleVerifyOtp}
            onResend={handleResendOtp}
            onChangeDestination={handleChangeDestination}
            onBack={() => router.push('/forgot-password')}
            destination={emailSentTo ?? ''}
            isEmail={isEmail}
            countdown={otpCountdown}
            setCountdown={(val) => {
              useAppStore.setState({ otpCountdown: val });
            }}
          />
        </div>
      }
    />
  );
}

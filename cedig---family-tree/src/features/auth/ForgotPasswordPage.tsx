"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import AuthLayout from "@/src/components/AuthLayout";
import ForgotForm from "@/src/components/forms/ForgotForm";
import { useAppStore } from "@/src/store";
import { useRecaptcha } from "@/src/hooks/useRecaptcha";
import { KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, addNotification } = useAppStore();
  const { executeRecaptcha, isVerifying, isConfigured } = useRecaptcha();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (contact: string) => {
    console.log('[FORGOT PASSWORD] Form submitted', { contact, isConfigured });
    setError(null);

    try {
      let token: string | undefined;
      if (isConfigured) {
        console.log('[FORGOT PASSWORD] Executing reCAPTCHA...');
        token = await executeRecaptcha("forgot_password");
        console.log('[FORGOT PASSWORD] reCAPTCHA token obtained');
      }
      console.log('[FORGOT PASSWORD] Calling store.forgotPassword...');
      await forgotPassword(contact, token);
      console.log('[FORGOT PASSWORD] forgotPassword resolved successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Нууц үг сэргээхэд алдаа гарлаа";
      console.error('[FORGOT PASSWORD] Error caught:', msg, err);
      setError(msg);
      addNotification("warn", "Нууц үг сэргээх алдаа", msg);
    }
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
              <KeyRound className="w-6 h-6 text-bronze" />
            </div>
            <h1 className="text-3xl font-bold leading-tight text-white">
              Нууц үгээ мартсан уу?<br />
              Сэргээхэд туслана.
            </h1>
            <p className="text-base text-white/60 leading-relaxed max-w-md">
              Бүртгэлтэй и-мэйл эсвэл утасны дугаараа оруулахад
              баталгаажуулах OTP код илгээх болно.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-3 text-sm text-white/50">
            <p>OTP код илгээгдсэний дараа:</p>
            <ol className="space-y-2 list-decimal list-inside">
              <li className="text-white/60">И-мэйл эсвэл утсаа шалгана уу</li>
              <li className="text-white/60">6 оронтой кодыг оруулна уу</li>
              <li className="text-white/60">Шинэ нууц үгээ үүсгэнэ үү</li>
            </ol>
          </div>
        </motion.div>
      }
      form={
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-8 sm:p-10">
          <ForgotForm
            onSubmit={handleSubmit}
            onBack={() => router.push("/login")}
            isSubmitting={isVerifying}
            error={error}
            onErrorClear={() => setError(null)}
          />
        </div>
      }
    />
  );
}

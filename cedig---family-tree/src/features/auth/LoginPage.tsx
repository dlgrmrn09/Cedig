"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Trees, Archive, Image, Users } from "lucide-react";
import AuthLayout from "@/src/components/AuthLayout";
import LoginForm from "./LoginForm";
import { useAppStore } from "@/src/store";
import { useRecaptcha } from "@/src/hooks/useRecaptcha";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmailPassword, loginWithEmailPasswordAndCaptcha, loginWithGoogle, loginWithFacebook, addNotification } = useAppStore();
  const { executeRecaptcha, isVerifying, isConfigured } = useRecaptcha();
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (data: { email: string; password: string }) => {
    setError(null);
    try {
      if (isConfigured) {
        const token = await executeRecaptcha("login");
        await loginWithEmailPasswordAndCaptcha(data.email, data.password, token);
      } else {
        await loginWithEmailPassword(data.email, data.password);
      }
      router.replace("/family-tree");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Нэвтрэхэд алдаа гарлаа";
      setError(msg);
      addNotification("warn", "Нэвтрэх алдаа", msg);
    }
  };

  const handlePhoneLogin = async (data: { phone: string; countryCode: string; password: string }) => {
    setError(null);
    try {
      if (isConfigured) {
        const token = await executeRecaptcha("login");
        await loginWithEmailPasswordAndCaptcha(`${data.countryCode}${data.phone}`, data.password, token);
      } else {
        await loginWithEmailPassword(`${data.countryCode}${data.phone}`, data.password);
      }
      router.replace("/family-tree");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Нэвтрэхэд алдаа гарлаа";
      setError(msg);
      addNotification("warn", "Нэвтрэх алдаа", msg);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      router.replace("/family-tree");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google нэвтрэлт амжилтгүй";
      setError(msg);
      addNotification("warn", "Google нэвтрэлт", msg);
    }
  };

  const handleFacebookLogin = async () => {
    setError(null);
    try {
      await loginWithFacebook();
      router.replace("/family-tree");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Facebook нэвтрэлт амжилтгүй";
      setError(msg);
      addNotification("warn", "Facebook нэвтрэлт", msg);
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
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-white">
              Гэр бүлийн холбоогоо<br />
              бэхжүүлээрэй.
            </h1>
            <p className="text-base text-white/70 leading-relaxed max-w-md">
              Ургийн модоо үүсгэж, гэр бүлийн түүхээ хойч үедээ өвлүүлээрэй.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {[
              { icon: Trees, label: 'Ургийн мод үүсгэх' },
              { icon: Archive, label: 'Гэр бүлийн архив хадгалах' },
              { icon: Image, label: 'Зураг болон түүх нэмэх' },
              { icon: Users, label: 'Гишүүдтэй хамтран ажиллах' },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 group"
              >
                <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all">
                  <feature.icon className="w-4 h-4 text-bronze" />
                </span>
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      }
      form={
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/5 border border-white/50 p-8 sm:p-10">
          <LoginForm
            onEmailLogin={handleEmailLogin}
            onPhoneLogin={handlePhoneLogin}
            onForgotPassword={() => router.push("/forgot-password")}
            onRegister={() => router.push("/register")}
            onGoogleLogin={handleGoogleLogin}
            onFacebookLogin={handleFacebookLogin}
            isSubmitting={isVerifying}
          />
        </div>
      }
    />
  );
}

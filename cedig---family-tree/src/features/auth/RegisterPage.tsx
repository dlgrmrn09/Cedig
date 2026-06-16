"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import AuthLayout from "@/src/components/AuthLayout";
import RegisterForm from "./RegisterForm";
import { useAppStore } from "@/src/store";
import { Scroll, Users, BookOpen, Shield } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const {
    registerWithEmailPassword,
    registerWithPhonePassword,
    loginWithGoogle,
    loginWithFacebook,
    startPhoneVerification,
    confirmPhoneOtp,
    clearPhoneVerification,
    phoneVerificationSent,
    isLoading,
    addNotification,
  } = useAppStore();
  const [error, setError] = useState<string | null>(null);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneDataPending, setPhoneDataPending] = useState<{
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    countryCode: string;
    password: string;
  } | null>(null);

  const handleEmailRegister = async (data: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    setError(null);
    try {
      await registerWithEmailPassword(
        data.firstName,
        data.lastName,
        data.username,
        data.email,
        data.password,
        true,
        true,
      );
      router.replace("/verify-email");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Бүртгэл үүсгэхэд алдаа гарлаа";
      setError(msg);
      addNotification("warn", "Бүртгэлийн алдаа", msg);
    }
  };

  const handlePhoneRegister = async (data: {
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    countryCode: string;
    password: string;
  }) => {
    setError(null);
    try {
      await startPhoneVerification(data.phone, data.countryCode);
      setPhoneDataPending(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Утас баталгаажуулах алдаа гарлаа";
      setError(msg);
      addNotification("warn", "Баталгаажуулалт", msg);
    }
  };

  const handleConfirmPhoneOtp = async () => {
    setError(null);
    try {
      await confirmPhoneOtp(phoneOtp);
      if (phoneDataPending) {
        await registerWithPhonePassword(
          phoneDataPending.firstName,
          phoneDataPending.lastName,
          phoneDataPending.username,
          phoneDataPending.phone,
          phoneDataPending.countryCode,
          phoneDataPending.password,
          true,
          true,
        );
      }
      router.replace("/family-tree");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "OTP баталгаажуулах алдаа гарлаа";
      setError(msg);
      addNotification("warn", "OTP алдаа", msg);
    }
  };

  const handleCancelPhoneVerification = () => {
    clearPhoneVerification();
    setPhoneOtp("");
    setPhoneDataPending(null);
  };

  const handleGoogleRegister = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      router.replace("/family-tree");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google бүртгэл амжилтгүй";
      setError(msg);
      addNotification("warn", "Google бүртгэл", msg);
    }
  };

  const handleFacebookRegister = async () => {
    setError(null);
    try {
      await loginWithFacebook();
      router.replace("/family-tree");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Facebook бүртгэл амжилтгүй";
      setError(msg);
      addNotification("warn", "Facebook бүртгэл", msg);
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
              Гэр бүлийн түүхээ<br />
              хадгалж, өвлүүлээрэй
            </h1>
            <p className="text-base text-white/70 leading-relaxed max-w-md">
              Өвөг дээдсийнхээ түүхийг тоон архивт хадгалж, хойч үедээ өвлүүлээрэй.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {[
              { icon: Scroll, label: 'Ургийн мод үүсгэх', desc: 'Гэр бүлийн модоо дүрслэн бүтээх' },
              { icon: BookOpen, label: 'Түүхэн мэдээлэл хадгалах', desc: 'Зураг, баримт, түүхэн өгүүллэг' },
              { icon: Users, label: 'Хамтран ажиллах', desc: 'Гэр бүлийн гишүүдийг урих' },
              { icon: Shield, label: 'Аюулгүй хадгалалт', desc: 'Таны өгөгдлийн нууцлал хамгаалагдана' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3 group"
              >
                <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white/20 transition-all">
                  <item.icon className="w-4 h-4 text-bronze" />
                </span>
                <div>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors block">
                    {item.label}
                  </span>
                  <span className="text-xs text-white/50">{item.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      }
      form={
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/5 border border-white/50 p-8 sm:p-10 max-h-[90vh] overflow-y-auto">
          <RegisterForm
            onEmailRegister={handleEmailRegister}
            onPhoneRegister={handlePhoneRegister}
            onLogin={() => router.push("/login")}
            onGoogleRegister={handleGoogleRegister}
            onFacebookRegister={handleFacebookRegister}
            phoneVerificationSent={phoneVerificationSent}
            phoneOtp={phoneOtp}
            onPhoneOtpChange={setPhoneOtp}
            onConfirmPhoneOtp={handleConfirmPhoneOtp}
            onCancelPhoneVerification={handleCancelPhoneVerification}
            isLoading={isLoading}
          />
        </div>
      }
    />
  );
}

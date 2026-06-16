"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Mail, Loader2, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";
import AuthLayout from "@/src/components/AuthLayout";
import { useAppStore } from "@/src/store";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { emailSentTo, checkEmailVerified, resendVerificationEmail, addNotification } = useAppStore();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  const email = emailSentTo || "";

  useEffect(() => {
    if (verified) return;
    const interval = setInterval(async () => {
      if (verified) return;
      try {
        const isVerified = await checkEmailVerified();
        if (isVerified) {
          setVerified(true);
          addNotification("success", "И-мэйл баталгаажлаа", "Таны и-мэйл хаяг амжилттай баталгаажлаа.");
          setTimeout(() => router.replace("/login"), 2000);
        }
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [verified, checkEmailVerified, addNotification, router]);

  const handleCheckNow = async () => {
    setChecking(true);
    try {
      const isVerified = await checkEmailVerified();
      if (isVerified) {
        setVerified(true);
        addNotification("success", "И-мэйл баталгаажлаа", "Таны и-мэйл хаяг амжилттай баталгаажлаа.");
        setTimeout(() => router.replace("/login"), 2000);
      } else {
        addNotification("warn", "Баталгаажаагүй", "И-мэйл хаягаа шалгаад баталгаажуулах товчийг дарна уу.");
      }
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerificationEmail();
      addNotification("success", "Дахин илгээлээ", "Баталгаажуулах и-мэйл дахин илгээгдлээ.");
    } catch {
      addNotification("warn", "Алдаа", "И-мэйл илгээхэд алдаа гарлаа.");
    } finally {
      setResending(false);
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
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-bronze" />
            </div>
            <h1 className="text-3xl font-bold leading-tight text-white">
              И-мэйл хаягаа<br />баталгаажуулна уу
            </h1>
            <p className="text-base text-white/70 leading-relaxed max-w-md">
              Таны бүртгэлтэй и-мэйл хаягруу баталгаажуулах холбоос илгээсэн.
              И-мэйлээ шалгаад баталгаажуулна уу.
            </p>
          </div>

          {verified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-emerald-400"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Баталгаажлаа!</p>
                <p className="text-xs opacity-80">Нэвтрэх хуудас руу шилжиж байна...</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      }
      form={
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-8 sm:p-10 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-bronze/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-bronze" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-ink">Баталгаажуулах и-мэйл илгээгдлээ</h2>
              <p className="text-sm text-stone-500">
                <span className="font-semibold text-ink">{email}</span> хаягруу баталгаажуулах холбоос илгээлээ.
              </p>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 text-left space-y-2 text-sm text-stone-600">
              <p className="font-semibold text-stone-700">Дараах алхамууд:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>И-мэйл хаягаа шалгана уу</li>
                <li>&quot;Verify Email&quot; товчийг дарна уу</li>
                <li>Баталгаажсаны дараа &quot;Шалгах&quot; товчийг дарна уу</li>
              </ol>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCheckNow}
                disabled={checking || verified}
                className="w-full bg-pine text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:bg-pine/90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Баталгаажсаныг шалгах
              </button>

              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full border border-stone-200 text-stone-600 py-3.5 rounded-xl font-semibold text-sm hover:bg-stone-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {resending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Дахин илгээх
              </button>

              <button
                onClick={() => router.push("/login")}
                className="w-full text-stone-400 py-2 text-sm hover:text-stone-600 transition-colors cursor-pointer"
              >
                Нэвтрэх хуудас руу буцах
              </button>
            </div>
          </div>
        </div>
      }
    />
  );
}

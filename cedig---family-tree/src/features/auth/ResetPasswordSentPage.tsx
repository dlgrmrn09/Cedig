"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Mail, ArrowLeft } from "lucide-react";
import AuthLayout from "@/src/components/AuthLayout";
import { useAppStore } from "@/src/store";

export default function ResetPasswordSentPage() {
  const router = useRouter();
  const { emailSentTo } = useAppStore();

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
              Нууц үг сэргээх<br />и-мэйл илгээгдлээ
            </h1>
            <p className="text-base text-white/70 leading-relaxed max-w-md">
              Таны и-мэйл хаягруу нууц үг сэргээх холбоос илгээлээ. И-мэйлээ шалгаад холбоос дээр дарж шинэ нууц үгээ үүсгэнэ үү.
            </p>
          </div>

          <div className="space-y-3 text-sm text-white/50">
            <p className="text-white/60 font-semibold">Анхааруулга:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>И-мэйл ирэхгүй бол спам хавтасыг шалгана уу</li>
              <li>Холбоос нь тодорхой хугацааны дараа хүчингүй болно</li>
            </ul>
          </div>
        </motion.div>
      }
      form={
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-8 sm:p-10 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-ink">И-мэйл илгээгдлээ</h2>
              <p className="text-sm text-stone-500">
                {emailSentTo ? (
                  <><span className="font-semibold text-ink">{emailSentTo}</span> хаягруу нууц үг сэргээх холбоос илгээлээ.</>
                ) : (
                  "Бүртгэлтэй и-мэйл хаягруу нууц үг сэргээх холбоос илгээлээ."
                )}
              </p>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 text-left space-y-2 text-sm text-stone-600">
              <p className="font-semibold text-stone-700">Дараах алхамууд:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>И-мэйл хаягаа шалгана уу</li>
                <li>Firebase-ээс илгээсэн и-мэйлийг нээнэ үү</li>
                <li>&quot;Reset Password&quot; холбоос дээр дарна уу</li>
                <li>Шинэ нууц үгээ оруулна уу</li>
              </ol>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="w-full border border-stone-200 text-stone-600 py-3.5 rounded-xl font-semibold text-sm hover:bg-stone-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Нэвтрэх хуудас руу буцах
            </button>
          </div>
        </div>
      }
    />
  );
}

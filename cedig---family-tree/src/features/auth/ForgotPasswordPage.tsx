"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import AuthLayout from "@/src/components/AuthLayout";
import ForgotForm from "@/src/components/forms/ForgotForm";
import { useAppStore } from "@/src/store";
import { KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useAppStore();

  const handleSubmit = (contact: string) => {
    forgotPassword(contact);
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
          />
        </div>
      }
    />
  );
}

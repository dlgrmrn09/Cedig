'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import AuthLayout from '@/src/components/AuthLayout';
import ResetForm from '@/src/components/forms/ResetForm';
import { useAppStore } from '@/src/store';
import { Lock } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword, emailSentTo } = useAppStore();

  const handleReset = (password: string) => {
    resetPassword(emailSentTo ?? '', password);
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
              <Lock className="w-6 h-6 text-bronze" />
            </div>
            <h1 className="text-3xl font-bold leading-tight text-white">
              Шинэ нууц үгээ<br />
              үүсгэнэ үү
            </h1>
            <p className="text-base text-white/60 leading-relaxed max-w-md">
              Нууц үгээ шинэчлэхдээ хүчтэй, аюулгүй
              нууц үг сонгохыг зөвлөж байна.
            </p>
          </div>

          <div className="space-y-3 text-sm text-white/50">
            <p className="text-white/60 font-medium">Зөвлөмж:</p>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-white/50">
                <span className="w-1 h-1 rounded-full bg-bronze" />
                Хамгийн багадаа 8 тэмдэгт
              </li>
              <li className="flex items-center gap-2 text-white/50">
                <span className="w-1 h-1 rounded-full bg-bronze" />
                Том, жижиг үсэг хослуулах
              </li>
              <li className="flex items-center gap-2 text-white/50">
                <span className="w-1 h-1 rounded-full bg-bronze" />
                Тоо болон тэмдэгт ашиглах
              </li>
              <li className="flex items-center gap-2 text-white/50">
                <span className="w-1 h-1 rounded-full bg-bronze" />
                Хувийн мэдээллээс зайлсхийх
              </li>
            </ul>
          </div>
        </motion.div>
      }
      form={
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-8 sm:p-10">
          <ResetForm
            onSubmit={handleReset}
            onBack={() => router.push('/login')}
          />
        </div>
      }
    />
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, Loader2, ArrowLeft, AlertCircle, Check, X } from 'lucide-react';

const resetSchema = z.object({
  password: z.string().min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Нууц үг таарахгүй байна',
  path: ['confirmPassword'],
});

type ResetData = z.infer<typeof resetSchema>;

interface ResetFormProps {
  onSubmit: (password: string) => void;
  onBack: () => void;
}

export default function ResetForm({ onSubmit, onBack }: ResetFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const passLen = password?.length ?? 0;

  const hasUpper = /[A-Z]/.test(password || '');
  const hasLower = /[a-z]/.test(password || '');
  const hasNumber = /[0-9]/.test(password || '');
  const hasSpecial = /[^A-Za-z0-9]/.test(password || '');

  const checks = [
    { label: '8+ тэмдэгт', pass: passLen >= 8 },
    { label: 'Том үсэг', pass: hasUpper },
    { label: 'Жижиг үсэг', pass: hasLower },
    { label: 'Тоо', pass: hasNumber },
    { label: 'Тэмдэгт', pass: hasSpecial },
  ];

  const strengthCount = checks.filter(c => c.pass).length;
  const strengthPercent = (strengthCount / 5) * 100;
  const strengthColor = strengthCount <= 1 ? 'bg-red-400' : strengthCount <= 2 ? 'bg-orange-400' : strengthCount <= 3 ? 'bg-yellow-400' : strengthCount <= 4 ? 'bg-lime-400' : 'bg-green-400';
  const strengthText = strengthCount <= 1 ? 'Сул' : strengthCount <= 2 ? 'Дунд зэрэг' : strengthCount <= 3 ? 'Сайн' : strengthCount <= 4 ? 'Хүчтэй' : 'Маш хүчтэй';
  const strengthTextColor = strengthCount <= 1 ? 'text-red-500' : strengthCount <= 2 ? 'text-orange-500' : strengthCount <= 3 ? 'text-yellow-600' : strengthCount <= 4 ? 'text-lime-600' : 'text-green-600';

  const handleFormSubmit = (data: ResetData) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSubmit(data.password);
    }, 1200);
  };

  const inputClasses = "w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/15 transition-all";

  return (
    <div className="space-y-6">
      {/* Back */}
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-ink transition-colors cursor-pointer">
        <ArrowLeft className="w-4 h-4" />
        Буцах
      </button>

      {/* Header */}
      <div className="text-center mb-2">
        <div className="w-14 h-14 rounded-2xl bg-bronze/10 mx-auto flex items-center justify-center mb-4">
          <Lock className="w-7 h-7 text-bronze" />
        </div>
        <h1 className="text-2xl font-bold text-ink">Нууц үг шинэчлэх</h1>
        <p className="text-sm text-stone-500 mt-1.5">
          Шинэ нууц үгээ үүсгэнэ үү
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* New Password */}
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Шинэ нууц үг"
            {...register('password')}
            className={`${inputClasses} pl-10 pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password.message}</p>
          )}
        </div>

        {/* Password Strength */}
        {password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className={`text-xs font-semibold ${strengthTextColor}`}>{strengthText}</span>
              <span className="text-[10px] text-stone-400">{Math.round(strengthPercent)}%</span>
            </div>
            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${strengthPercent}%` }}
                className={`h-full rounded-full ${strengthColor}`}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
            <div className="grid grid-cols-1 gap-1">
              {checks.map((check) => (
                <div key={check.label} className="flex items-center gap-2 text-xs">
                  {check.pass ? <Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-stone-300 shrink-0" />}
                  <span className={check.pass ? 'text-green-700' : 'text-stone-400'}>{check.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Confirm Password */}
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Нууц үг давтах"
            {...register('confirmPassword')}
            className={`${inputClasses} pl-10 pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors cursor-pointer"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Match indicator */}
        {confirmPassword && password !== confirmPassword && (
          <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Нууц үг таарахгүй байна</p>
        )}
        {confirmPassword && password === confirmPassword && password.length >= 8 && (
          <p className="text-xs text-green-600 flex items-center gap-1"><Check className="w-3 h-3" />Нууц үг таарч байна</p>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading || !password || !confirmPassword || password !== confirmPassword || password.length < 8}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-pine text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Нууц Үг Шинэчлэх
        </motion.button>
      </form>
    </div>
  );
}

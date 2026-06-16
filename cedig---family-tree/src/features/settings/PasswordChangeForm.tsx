'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  CircleAlert,
} from 'lucide-react';
import {
  passwordChangeSchema,
  type PasswordChangeFormData,
} from './validation';

interface PasswordChangeFormProps {
  onChangePassword: (data: PasswordChangeFormData) => Promise<void>;
}

export default function PasswordChangeForm({
  onChangePassword,
}: PasswordChangeFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');
  const passLen = newPassword?.length ?? 0;
  const hasUpper = /[A-Z]/.test(newPassword || '');
  const hasLower = /[a-z]/.test(newPassword || '');
  const hasNumber = /[0-9]/.test(newPassword || '');
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword || '');

  const strengthChecks = [
    { label: '8+ тэмдэгт', pass: passLen >= 8 },
    { label: 'Том үсэг', pass: hasUpper },
    { label: 'Жижиг үсэг', pass: hasLower },
    { label: 'Тоо', pass: hasNumber },
    { label: 'Тэмдэгт', pass: hasSpecial },
  ];

  const strengthCount = strengthChecks.filter((c) => c.pass).length;
  const strengthPercent = (strengthCount / 5) * 100;
  const strengthColor =
    strengthCount <= 1
      ? 'bg-red-400'
      : strengthCount <= 2
        ? 'bg-orange-400'
        : strengthCount <= 3
          ? 'bg-yellow-400'
          : strengthCount <= 4
            ? 'bg-lime-400'
            : 'bg-green-400';
  const strengthText =
    strengthCount <= 1
      ? 'Сул'
      : strengthCount <= 2
        ? 'Дунд зэрэг'
        : strengthCount <= 3
          ? 'Сайн'
          : strengthCount <= 4
            ? 'Хүчтэй'
            : 'Маш хүчтэй';
  const strengthTextColor =
    strengthCount <= 1
      ? 'text-red-500'
      : strengthCount <= 2
        ? 'text-orange-500'
        : strengthCount <= 3
          ? 'text-yellow-600'
          : strengthCount <= 4
            ? 'text-lime-600'
            : 'text-green-600';

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        reset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, reset]);

  const inputClasses =
    'w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all';

  const onSubmit = async (data: PasswordChangeFormData) => {
    setIsSaving(true);
    setError(null);
    try {
      await onChangePassword(data);
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Нууц үг солиход алдаа гарлаа';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6"
    >
      <div className="pb-4 border-b border-stone-200/50 flex justify-between items-center">
        <div>
          <h3 className="font-display font-bold text-lg text-ink">
            Нууц үг солих
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Нууц үгээ тогтмол шинэчлэж байх нь аюулгүй байдлыг хангана
          </p>
        </div>
        <Lock className="w-5 h-5 text-bronze/80" />
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-bold"
        >
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>Нууц үг амжилттай солигдлоо.</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-xs"
        >
          <CircleAlert className="w-4.5 h-4.5 text-red-600 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink/60 tracking-wider uppercase block">
            Одоогийн нууц үг
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type={showCurrent ? 'text' : 'password'}
              placeholder="Одоогийн нууц үг"
              {...register('currentPassword')}
              className={`${inputClasses} pl-10 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors cursor-pointer"
            >
              {showCurrent ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <CircleAlert className="w-3 h-3" />
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink/60 tracking-wider uppercase block">
            Шинэ нууц үг
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="Шинэ нууц үг"
              {...register('newPassword')}
              className={`${inputClasses} pl-10 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors cursor-pointer"
            >
              {showNew ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <CircleAlert className="w-3 h-3" />
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {newPassword && (
          <div className="space-y-2 p-4 bg-stone-50 rounded-xl border border-stone-100">
            <div className="flex justify-between items-center">
              <span className={`text-xs font-semibold ${strengthTextColor}`}>
                {strengthText}
              </span>
              <span className="text-[10px] text-stone-400">
                {Math.round(strengthPercent)}%
              </span>
            </div>
            <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${strengthPercent}%` }}
                className={`h-full rounded-full ${strengthColor}`}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <div className="grid grid-cols-5 gap-1">
              {strengthChecks.map((check) => (
                <div key={check.label} className="text-[10px] text-center">
                  <span
                    className={
                      check.pass ? 'text-green-600' : 'text-stone-400'
                    }
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink/60 tracking-wider uppercase block">
            Шинэ нууц үг давтах
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Шинэ нууц үг давтах"
              {...register('confirmPassword')}
              className={`${inputClasses} pl-10 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors cursor-pointer"
            >
              {showConfirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <CircleAlert className="w-3 h-3" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-pine text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:bg-pine/90 active:bg-pine/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            Нууц үг солих
          </button>
        </div>
      </form>
    </motion.div>
  );
}

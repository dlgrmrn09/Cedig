'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { User, Save, Loader2, CheckCircle2, CircleAlert } from 'lucide-react';
import { profileSchema, type ProfileFormData } from './validation';

interface ProfileSectionProps {
  initialFirstName: string;
  initialLastName: string;
  initialUsername: string;
  onSave: (data: ProfileFormData) => Promise<void>;
}

export default function ProfileSection({
  initialFirstName,
  initialLastName,
  initialUsername,
  onSave,
}: ProfileSectionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      username: initialUsername,
    },
  });

  const values = watch();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const hasChanges =
    values.firstName !== initialFirstName ||
    values.lastName !== initialLastName ||
    values.username !== initialUsername;

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      await onSave(data);
      setSuccess(true);
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
            Хувийн Мэдээлэл
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Өөрийн нэр, овог, хэрэглэгчийн нэрээ шинэчлэх
          </p>
        </div>
        <User className="w-5 h-5 text-bronze/80" />
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-bold"
        >
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>Профайл амжилттай шинэчлэгдлээ.</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 tracking-wider uppercase block">
              Нэр
            </label>
            <input
              type="text"
              placeholder="Нэр"
              {...register('firstName')}
              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <CircleAlert className="w-3 h-3" />
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 tracking-wider uppercase block">
              Овог
            </label>
            <input
              type="text"
              placeholder="Овог"
              {...register('lastName')}
              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <CircleAlert className="w-3 h-3" />
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink/60 tracking-wider uppercase block">
            Хэрэглэгчийн нэр
          </label>
          <input
            type="text"
            placeholder="Хэрэглэгчийн нэр"
            {...register('username')}
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all"
          />
          {errors.username && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <CircleAlert className="w-3 h-3" />
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!hasChanges || isSaving}
            className="inline-flex items-center gap-2 bg-pine text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:bg-pine/90 active:bg-pine/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Хадгалах
          </button>
        </div>
      </form>
    </motion.div>
  );
}

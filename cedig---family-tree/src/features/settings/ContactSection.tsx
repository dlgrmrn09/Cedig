'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import {
  Mail,
  Phone,
  Loader2,
  CheckCircle2,
  CircleAlert,
  Save,
} from 'lucide-react';
import { emailSchema, phoneSchema, type EmailFormData, type PhoneFormData } from './validation';

interface ContactSectionProps {
  initialEmail: string;
  initialPhone: string;
  initialCountryCode: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  authMethod: 'email' | 'phone';
  onEmailSave: (data: EmailFormData) => Promise<void>;
  onPhoneSave: (data: PhoneFormData) => Promise<void>;
}

export default function ContactSection({
  initialEmail,
  initialPhone,
  initialCountryCode,
  emailVerified,
  phoneVerified,
  authMethod,
  onEmailSave,
  onPhoneSave,
}: ContactSectionProps) {
  const [emailSaving, setEmailSaving] = useState(false);
  const [phoneSaving, setPhoneSaving] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [phoneSuccess, setPhoneSuccess] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: initialEmail },
  });

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: initialPhone, countryCode: initialCountryCode },
  });

  const emailValue = emailForm.watch('email');
  const phoneValue = phoneForm.watch('phone');

  useEffect(() => {
    if (emailSuccess) {
      const timer = setTimeout(() => setEmailSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [emailSuccess]);

  useEffect(() => {
    if (phoneSuccess) {
      const timer = setTimeout(() => setPhoneSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [phoneSuccess]);

  const emailChanged = emailValue !== initialEmail;
  const phoneChanged = phoneValue !== initialPhone;

  const handleEmailSubmit = async (data: EmailFormData) => {
    setEmailSaving(true);
    try {
      await onEmailSave(data);
      setEmailSuccess(true);
    } finally {
      setEmailSaving(false);
    }
  };

  const handlePhoneSubmit = async (data: PhoneFormData) => {
    setPhoneSaving(true);
    try {
      await onPhoneSave(data);
      setPhoneSuccess(true);
    } finally {
      setPhoneSaving(false);
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
            Холбоо Барих Мэдээлэл
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            И-мэйл болон утасны дугаараа шинэчлэх
          </p>
        </div>
        <Mail className="w-5 h-5 text-bronze/80" />
      </div>

      {emailSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-bold"
        >
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>И-мэйл амжилттай шинэчлэгдлээ.</span>
        </motion.div>
      )}

      {/* Email Section */}
      <div className="p-5 rounded-xl bg-stone-50/50 border border-stone-100 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-ink/60 tracking-wider uppercase flex items-center gap-2">
            <Mail className="w-4 h-4 text-bronze" />
            И-мэйл
          </label>
          <span
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
              emailVerified
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {emailVerified ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Баталгаажсан
              </>
            ) : (
              <>
                <CircleAlert className="w-3 h-3" />
                Баталгаажаагүй
              </>
            )}
          </span>
        </div>

        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-3">
          <div>
            <input
              type="email"
              placeholder={
                authMethod === 'phone'
                  ? 'И-мэйл хаяг нэмэх'
                  : 'И-мэйл хаяг'
              }
              {...emailForm.register('email')}
              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all"
            />
            {emailForm.formState.errors.email && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1.5">
                <CircleAlert className="w-3 h-3" />
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!emailChanged || emailSaving}
              className="inline-flex items-center gap-2 bg-pine text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-lg shadow-pine/10 hover:bg-pine/90 active:bg-pine/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {authMethod === 'phone' && !initialEmail ? 'И-мэйл нэмэх' : 'И-мэйл шинэчлэх'}
            </button>
          </div>
        </form>
      </div>

      {phoneSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-bold"
        >
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>Утасны дугаар амжилттай шинэчлэгдлээ.</span>
        </motion.div>
      )}

      {/* Phone Section */}
      <div className="p-5 rounded-xl bg-stone-50/50 border border-stone-100 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-ink/60 tracking-wider uppercase flex items-center gap-2">
            <Phone className="w-4 h-4 text-bronze" />
            Утасны дугаар
          </label>
          <span
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
              phoneVerified
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {phoneVerified ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Баталгаажсан
              </>
            ) : (
              <>
                <CircleAlert className="w-3 h-3" />
                Баталгаажаагүй
              </>
            )}
          </span>
        </div>

        <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-3">
          <div className="flex gap-2">
            <select
              {...phoneForm.register('countryCode')}
              className="w-28 bg-white border border-stone-200 rounded-xl px-3 py-3 text-sm text-ink focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all cursor-pointer"
            >
              <option value="+976">🇲🇳 +976</option>
              <option value="+86">🇨🇳 +86</option>
              <option value="+7">🇷🇺 +7</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+82">🇰🇷 +82</option>
              <option value="+81">🇯🇵 +81</option>
            </select>
            <div className="relative flex-1">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="tel"
                placeholder={
                  authMethod === 'email'
                    ? 'Утасны дугаар нэмэх'
                    : 'Утасны дугаар'
                }
                {...phoneForm.register('phone')}
                className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all"
              />
            </div>
          </div>
          {phoneForm.formState.errors.phone && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <CircleAlert className="w-3 h-3" />
              {phoneForm.formState.errors.phone.message}
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!phoneChanged || phoneSaving}
              className="inline-flex items-center gap-2 bg-pine text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-lg shadow-pine/10 hover:bg-pine/90 active:bg-pine/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {phoneSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {authMethod === 'email' && !initialPhone ? 'Утас нэмэх' : 'Утас шинэчлэх'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

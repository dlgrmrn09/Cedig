'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { Mail, Phone, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Зөв и-мэйл хаяг оруулна уу'),
});

const phoneSchema = z.object({
  phone: z.string().min(8, 'Утасны дугаараа зөв оруулна уу'),
  countryCode: z.string(),
});

type EmailData = z.infer<typeof emailSchema>;
type PhoneData = z.infer<typeof phoneSchema>;

interface ForgotFormProps {
  onSubmit: (contact: string) => void;
  onBack: () => void;
}

export default function ForgotForm({ onSubmit, onBack }: ForgotFormProps) {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);

  const emailForm = useForm<EmailData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const phoneForm = useForm<PhoneData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '', countryCode: '+976' },
  });

  const handleEmailSubmit = (data: EmailData) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onSubmit(data.email); }, 1000);
  };

  const handlePhoneSubmit = (data: PhoneData) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onSubmit(`${data.countryCode}${data.phone}`); }, 1000);
  };

  const inputClasses = "w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/15 transition-all";
  const tabClasses = (active: boolean) =>
    `relative px-5 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
      active ? 'bg-ink text-white shadow-sm' : 'text-stone-500 hover:text-ink hover:bg-stone-100'
    }`;

  const countryCodes = [
    { code: '+976', flag: '🇲🇳' },
    { code: '+86', flag: '🇨🇳' },
    { code: '+7', flag: '🇷🇺' },
    { code: '+1', flag: '🇺🇸' },
    { code: '+82', flag: '🇰🇷' },
    { code: '+81', flag: '🇯🇵' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-ink">Нууц үг сэргээх</h1>
        <p className="text-sm text-stone-500 mt-1.5">
          Бүртгэлтэй и-мэйл эсвэл утасны дугаараа оруулна уу
        </p>
      </div>

      {/* Recovery Method Tabs */}
      <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl">
        <button type="button" onClick={() => setMethod('email')} className={`flex-1 ${tabClasses(method === 'email')}`}>
          <Mail className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          И-мэйл
        </button>
        <button type="button" onClick={() => setMethod('phone')} className={`flex-1 ${tabClasses(method === 'phone')}`}>
          <Phone className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          Утас
        </button>
      </div>

      {/* Email Recovery */}
      {method === 'email' && (
        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="email"
              placeholder="И-мэйл хаяг"
              {...emailForm.register('email')}
              className={`${inputClasses} pl-10`}
            />
            {emailForm.formState.errors.email && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-pine text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            OTP Код Илгээх
          </motion.button>
        </form>
      )}

      {/* Phone Recovery */}
      {method === 'phone' && (
        <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-1.5">
              Утасны дугаар
            </label>
            <div className="flex gap-2">
              <select
                {...phoneForm.register('countryCode')}
                className="w-28 bg-white border border-stone-200 rounded-xl px-3 py-3.5 text-sm text-ink focus:outline-none focus:border-bronze cursor-pointer"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="tel"
                  placeholder="Утасны дугаар"
                  {...phoneForm.register('phone')}
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </div>
            {phoneForm.formState.errors.phone && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {phoneForm.formState.errors.phone.message}
              </p>
            )}
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-pine text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            OTP Код Илгээх
          </motion.button>
        </form>
      )}

      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2 text-sm font-medium text-stone-500 hover:text-ink transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Буцах
      </button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { Mail, Phone, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const emailLoginSchema = z.object({
  email: z.string().email('Зөв и-мэйл хаяг оруулна уу'),
  password: z.string().min(6, 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой'),
  remember: z.boolean().optional(),
});

const phoneLoginSchema = z.object({
  phone: z.string().min(8, 'Утасны дугаараа зөв оруулна уу'),
  countryCode: z.string(),
  password: z.string().min(6, 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой'),
});

type EmailLoginData = z.infer<typeof emailLoginSchema>;
type PhoneLoginData = z.infer<typeof phoneLoginSchema>;

interface LoginFormProps {
  onEmailLogin: (data: EmailLoginData) => void;
  onPhoneLogin: (data: PhoneLoginData) => void;
  onForgotPassword: () => void;
  onRegister: () => void;
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
}

export default function LoginForm({
  onEmailLogin,
  onPhoneLogin,
  onForgotPassword,
  onRegister,
  onGoogleLogin,
  onFacebookLogin,
}: LoginFormProps) {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

  const emailForm = useForm<EmailLoginData>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: { email: '', password: '', remember: false },
  });

  const phoneForm = useForm<PhoneLoginData>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: { phone: '', countryCode: '+976', password: '' },
  });

  const handleEmailSubmit = (data: EmailLoginData) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onEmailLogin(data); }, 1200);
  };

  const handlePhoneSubmit = (data: PhoneLoginData) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onPhoneLogin(data); }, 1200);
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    setTimeout(() => {
      setSocialLoading(null);
      if (provider === 'google') onGoogleLogin();
      else onFacebookLogin();
    }, 1000);
  };

  const inputClasses = "w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all";
  const inputIconClasses = "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400";
  const tabClasses = (active: boolean) =>
    `relative px-5 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
      active ? 'bg-ink text-white shadow-sm' : 'text-stone-500 hover:text-ink hover:bg-stone-100'
    }`;

  const countryCodes = [
    { code: '+976', flag: '🇲🇳', label: 'Монгол' },
    { code: '+86', flag: '🇨🇳', label: 'Хятад' },
    { code: '+7', flag: '🇷🇺', label: 'Орос' },
    { code: '+1', flag: '🇺🇸', label: 'Америк' },
    { code: '+82', flag: '🇰🇷', label: 'Солонгос' },
    { code: '+81', flag: '🇯🇵', label: 'Япон' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-ink">Тавтай морилно уу</h1>
        <p className="text-sm text-stone-500 mt-1.5">
          Өөрийн бүртгэлээр нэвтрэх
        </p>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          disabled={!!socialLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all cursor-pointer disabled:opacity-50"
        >
          {socialLoading === 'google' ? (
            <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.782 0 3.414.664 4.662 1.76l2.313-2.313C17.397 1.71 14.957 1 12.24 1c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.772 0 10-4.058 10-10 0-.671-.059-1.314-.171-1.928l-9.829.213z"/>
              <path fill="#34A853" d="M12.24 19c2.788 0 5.114-1.002 6.818-2.645l-3.26-2.532c-.9.607-2.052.968-3.558.968-2.735 0-5.05-1.848-5.878-4.34H2.682v2.918C4.396 17.276 7.996 19 12.24 19z"/>
              <path fill="#4A90E2" d="M6.362 14.45c-.364-1.09-.571-2.256-.571-3.45s.207-2.36.571-3.45V5.632H2.682C1.637 7.724 1 10.089 1 12.5s.637 4.776 1.682 6.868l3.16-2.568.52-.35z"/>
              <path fill="#FBBC05" d="M12.24 5.045c1.516 0 2.876.525 3.948 1.556l2.96-2.96C17.345 1.99 15.022 1 12.24 1 7.996 1 4.396 2.724 2.682 5.632l3.68 2.868c.828-2.492 3.143-4.455 5.878-4.455z"/>
            </svg>
          )}
          Google-р нэвтрэх
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('facebook')}
          disabled={!!socialLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all cursor-pointer disabled:opacity-50"
        >
          {socialLoading === 'facebook' ? (
            <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
          ) : (
            <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          )}
          Facebook-ээр нэвтрэх
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-stone-200" />
        <span className="flex-shrink mx-4 text-xs font-semibold text-stone-400 uppercase tracking-widest">
          Эсвэл
        </span>
        <div className="flex-grow border-t border-stone-200" />
      </div>

      {/* Login Method Tabs */}
      <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl">
        <button type="button" onClick={() => setLoginMethod('email')} className={`flex-1 ${tabClasses(loginMethod === 'email')}`}>
          <Mail className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          И-мэйл
        </button>
        <button type="button" onClick={() => setLoginMethod('phone')} className={`flex-1 ${tabClasses(loginMethod === 'phone')}`}>
          <Phone className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          Утас
        </button>
      </div>

      {/* Email Login Form */}
      {loginMethod === 'email' && (
        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
          <div className="relative">
            <Mail className={inputIconClasses} />
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
          <div className="relative">
            <Lock className={inputIconClasses} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Нууц үг"
              {...emailForm.register('password')}
              className={`${inputClasses} pl-10 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {emailForm.formState.errors.password && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {emailForm.formState.errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...emailForm.register('remember')} className="w-4 h-4 rounded border-stone-300 text-bronze focus:ring-bronze/30 accent-bronze" />
              <span className="text-sm text-stone-600">Сануулах</span>
            </label>
            <button type="button" onClick={onForgotPassword} className="text-sm font-medium text-bronze hover:text-bronze/80 transition-colors cursor-pointer">
              Нууц үг мартсан?
            </button>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-pine text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:bg-pine/90 active:bg-pine/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Нэвтрэх
          </motion.button>
        </form>
      )}

      {/* Phone Login Form */}
      {loginMethod === 'phone' && (
        <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-1.5">
              Утасны дугаар
            </label>
            <div className="flex gap-2">
              <select
                {...phoneForm.register('countryCode')}
                className="w-28 bg-white border border-stone-200 rounded-xl px-3 py-3.5 text-sm text-ink focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all cursor-pointer"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <Phone className={inputIconClasses} />
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
          <div className="relative">
            <Lock className={inputIconClasses} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Нууц үг"
              {...phoneForm.register('password')}
              className={`${inputClasses} pl-10 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {phoneForm.formState.errors.password && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {phoneForm.formState.errors.password.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onForgotPassword} className="text-sm font-medium text-bronze hover:text-bronze/80 transition-colors cursor-pointer">
              Нууц үг мартсан?
            </button>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-pine text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:bg-pine/90 active:bg-pine/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Нэвтрэх
          </motion.button>
        </form>
      )}

      {/* Register Link */}
      <p className="text-center text-sm text-stone-500">
        Бүртгэл нээгээгүй юу?{' '}
        <button type="button" onClick={onRegister} className="font-semibold text-bronze hover:text-bronze/80 transition-colors cursor-pointer">
          Бүртгэл үүсгэх
        </button>
      </p>
    </div>
  );
}

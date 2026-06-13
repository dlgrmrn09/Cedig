'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { Mail, Phone, Lock, Eye, EyeOff, Loader2, AlertCircle, Check, X, User } from 'lucide-react';

const emailRegisterSchema = z.object({
  username: z.string().min(3, 'Хэрэглэгчийн нэр хамгийн багадаа 3 тэмдэгт байх ёстой').regex(/^[a-zA-Z0-9_]+$/, 'Зөвхөн латин үсэг, тоо, доогуур зураас'),
  firstName: z.string().min(2, 'Нэрээ оруулна уу'),
  lastName: z.string().min(2, 'Овгоо оруулна уу'),
  email: z.string().email('Зөв и-мэйл хаяг оруулна уу'),
  password: z.string().min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой'),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine((val) => val === true, 'Үйлчилгээний нөхцөлийг зөвшөөрөх шаардлагатай'),
  agreePrivacy: z.boolean().refine((val) => val === true, 'Нууцлалын бодлогыг зөвшөөрөх шаардлагатай'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Нууц үг таарахгүй байна',
  path: ['confirmPassword'],
});

const phoneRegisterSchema = z.object({
  username: z.string().min(3, 'Хэрэглэгчийн нэр хамгийн багадаа 3 тэмдэгт байх ёстой').regex(/^[a-zA-Z0-9_]+$/, 'Зөвхөн латин үсэг, тоо, доогуур зураас'),
  firstName: z.string().min(2, 'Нэрээ оруулна уу'),
  lastName: z.string().min(2, 'Овгоо оруулна уу'),
  countryCode: z.string(),
  phone: z.string().min(8, 'Утасны дугаараа зөв оруулна уу'),
  password: z.string().min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой'),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine((val) => val === true, 'Үйлчилгээний нөхцөлийг зөвшөөрөх шаардлагатай'),
  agreePrivacy: z.boolean().refine((val) => val === true, 'Нууцлалын бодлогыг зөвшөөрөх шаардлагатай'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Нууц үг таарахгүй байна',
  path: ['confirmPassword'],
});

type EmailRegisterData = z.infer<typeof emailRegisterSchema>;
type PhoneRegisterData = z.infer<typeof phoneRegisterSchema>;

interface RegisterFormProps {
  onEmailRegister: (data: EmailRegisterData) => void;
  onPhoneRegister: (data: PhoneRegisterData) => void;
  onLogin: () => void;
  onGoogleRegister: () => void;
  onFacebookRegister: () => void;
}

export default function RegisterForm({
  onEmailRegister,
  onPhoneRegister,
  onLogin,
  onGoogleRegister,
  onFacebookRegister,
}: RegisterFormProps) {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

  const emailForm = useForm<EmailRegisterData>({
    resolver: zodResolver(emailRegisterSchema),
    defaultValues: { username: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '', agreeTerms: false, agreePrivacy: false },
  });

  const phoneForm = useForm<PhoneRegisterData>({
    resolver: zodResolver(phoneRegisterSchema),
    defaultValues: { username: '', firstName: '', lastName: '', countryCode: '+976', phone: '', password: '', confirmPassword: '', agreeTerms: false, agreePrivacy: false },
  });

  const watchPassword = method === 'email' ? emailForm.watch('password') : phoneForm.watch('password');
  const passLen = watchPassword?.length ?? 0;
  const hasUpper = /[A-Z]/.test(watchPassword || '');
  const hasLower = /[a-z]/.test(watchPassword || '');
  const hasNumber = /[0-9]/.test(watchPassword || '');
  const hasSpecial = /[^A-Za-z0-9]/.test(watchPassword || '');

  const strengthChecks = [
    { label: '8+ тэмдэгт', pass: passLen >= 8 },
    { label: 'Том үсэг', pass: hasUpper },
    { label: 'Жижиг үсэг', pass: hasLower },
    { label: 'Тоо', pass: hasNumber },
    { label: 'Тэмдэгт', pass: hasSpecial },
  ];

  const strengthCount = strengthChecks.filter(c => c.pass).length;
  const strengthPercent = (strengthCount / 5) * 100;
  const strengthColor = strengthCount <= 1 ? 'bg-red-400' : strengthCount <= 2 ? 'bg-orange-400' : strengthCount <= 3 ? 'bg-yellow-400' : strengthCount <= 4 ? 'bg-lime-400' : 'bg-green-400';
  const strengthText = strengthCount <= 1 ? 'Сул' : strengthCount <= 2 ? 'Дунд зэрэг' : strengthCount <= 3 ? 'Сайн' : strengthCount <= 4 ? 'Хүчтэй' : 'Маш хүчтэй';
  const strengthTextColor = strengthCount <= 1 ? 'text-red-500' : strengthCount <= 2 ? 'text-orange-500' : strengthCount <= 3 ? 'text-yellow-600' : strengthCount <= 4 ? 'text-lime-600' : 'text-green-600';

  const handleEmailSubmit = (data: EmailRegisterData) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onEmailRegister(data); }, 1200);
  };

  const handlePhoneSubmit = (data: PhoneRegisterData) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onPhoneRegister(data); }, 1200);
  };

  const handleSocial = (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    setTimeout(() => {
      setSocialLoading(null);
      if (provider === 'google') onGoogleRegister();
      else onFacebookRegister();
    }, 1000);
  };

  const inputClasses = "w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all";
  const inputIconClasses = "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400";
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
        <h1 className="text-2xl font-bold text-ink">Бүртгэл үүсгэх</h1>
        <p className="text-sm text-stone-500 mt-1.5">
          Гэр бүлийн түүхээ хадгалж эхлэх
        </p>
      </div>

      {/* Social Register Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleSocial('google')}
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
          Google-р бүртгүүлэх
        </button>
        <button
          type="button"
          onClick={() => handleSocial('facebook')}
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
          Facebook-ээр бүртгүүлэх
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

      {/* Method Tabs */}
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

      {/* Email Registration Form */}
      {method === 'email' && (
        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Нэр" {...emailForm.register('firstName')} className={inputClasses} />
            <input type="text" placeholder="Овог" {...emailForm.register('lastName')} className={inputClasses} />
          </div>
          <div className="relative">
            <User className={inputIconClasses} />
            <input type="text" placeholder="Хэрэглэгчийн нэр" {...emailForm.register('username')} className={`${inputClasses} pl-10`} />
          </div>
          {emailForm.formState.errors.username && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-[-8px]"><AlertCircle className="w-3 h-3" />{emailForm.formState.errors.username.message}</p>
          )}
          <div className="relative">
            <Mail className={inputIconClasses} />
            <input type="email" placeholder="И-мэйл хаяг" {...emailForm.register('email')} className={`${inputClasses} pl-10`} />
          </div>
          <div className="relative">
            <Lock className={inputIconClasses} />
            <input type={showPassword ? 'text' : 'password'} placeholder="Нууц үг" {...emailForm.register('password')} className={`${inputClasses} pl-10 pr-10`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors cursor-pointer">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="relative">
            <Lock className={inputIconClasses} />
            <input type={showConfirm ? 'text' : 'password'} placeholder="Нууц үг давтах" {...emailForm.register('confirmPassword')} className={`${inputClasses} pl-10 pr-10`} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors cursor-pointer">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {watchPassword && (
            <PasswordStrength checks={strengthChecks} percent={strengthPercent} color={strengthColor} text={strengthText} textColor={strengthTextColor} />
          )}
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" {...emailForm.register('agreeTerms')} className="mt-0.5 w-4 h-4 rounded border-stone-300 text-bronze focus:ring-bronze/30 accent-bronze cursor-pointer" />
              <span className="text-xs text-stone-600 leading-relaxed group-hover:text-stone-800 transition-colors">Үйлчилгээний нөхцөлийг зөвшөөрч байна</span>
            </label>
            {emailForm.formState.errors.agreeTerms && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{emailForm.formState.errors.agreeTerms.message}</p>}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" {...emailForm.register('agreePrivacy')} className="mt-0.5 w-4 h-4 rounded border-stone-300 text-bronze focus:ring-bronze/30 accent-bronze cursor-pointer" />
              <span className="text-xs text-stone-600 leading-relaxed group-hover:text-stone-800 transition-colors">Нууцлалын бодлогыг зөвшөөрч байна</span>
            </label>
            {emailForm.formState.errors.agreePrivacy && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{emailForm.formState.errors.agreePrivacy.message}</p>}
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-pine text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:bg-pine/90 active:bg-pine/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Бүртгэл үүсгэх
          </motion.button>
        </form>
      )}

      {/* Phone Registration Form */}
      {method === 'phone' && (
        <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Нэр" {...phoneForm.register('firstName')} className={inputClasses} />
            <input type="text" placeholder="Овог" {...phoneForm.register('lastName')} className={inputClasses} />
          </div>
          <div className="relative">
            <User className={inputIconClasses} />
            <input type="text" placeholder="Хэрэглэгчийн нэр" {...phoneForm.register('username')} className={`${inputClasses} pl-10`} />
          </div>
          {phoneForm.formState.errors.username && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-[-8px]"><AlertCircle className="w-3 h-3" />{phoneForm.formState.errors.username.message}</p>
          )}
          <div>
            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-1.5">Утасны дугаар</label>
            <div className="flex gap-2">
              <select {...phoneForm.register('countryCode')} className="w-28 bg-white border border-stone-200 rounded-xl px-3 py-3.5 text-sm text-ink focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 cursor-pointer">
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <Phone className={inputIconClasses} />
                <input type="tel" placeholder="Утасны дугаар" {...phoneForm.register('phone')} className={`${inputClasses} pl-10`} />
              </div>
            </div>
          </div>
          <div className="relative">
            <Lock className={inputIconClasses} />
            <input type={showPassword ? 'text' : 'password'} placeholder="Нууц үг" {...phoneForm.register('password')} className={`${inputClasses} pl-10 pr-10`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors cursor-pointer">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="relative">
            <Lock className={inputIconClasses} />
            <input type={showConfirm ? 'text' : 'password'} placeholder="Нууц үг давтах" {...phoneForm.register('confirmPassword')} className={`${inputClasses} pl-10 pr-10`} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors cursor-pointer">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {watchPassword && (
            <PasswordStrength checks={strengthChecks} percent={strengthPercent} color={strengthColor} text={strengthText} textColor={strengthTextColor} />
          )}
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" {...phoneForm.register('agreeTerms')} className="mt-0.5 w-4 h-4 rounded border-stone-300 text-bronze focus:ring-bronze/30 accent-bronze cursor-pointer" />
              <span className="text-xs text-stone-600 leading-relaxed group-hover:text-stone-800 transition-colors">Үйлчилгээний нөхцөлийг зөвшөөрч байна</span>
            </label>
            {phoneForm.formState.errors.agreeTerms && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{phoneForm.formState.errors.agreeTerms.message}</p>}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" {...phoneForm.register('agreePrivacy')} className="mt-0.5 w-4 h-4 rounded border-stone-300 text-bronze focus:ring-bronze/30 accent-bronze cursor-pointer" />
              <span className="text-xs text-stone-600 leading-relaxed group-hover:text-stone-800 transition-colors">Нууцлалын бодлогыг зөвшөөрч байна</span>
            </label>
            {phoneForm.formState.errors.agreePrivacy && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{phoneForm.formState.errors.agreePrivacy.message}</p>}
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-pine text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:bg-pine/90 active:bg-pine/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Бүртгэл үүсгэх
          </motion.button>
        </form>
      )}

      {/* Login Link */}
      <p className="text-center text-sm text-stone-500">
        Аль хэдийн бүртгүүлсэн үү?{' '}
        <button type="button" onClick={onLogin} className="font-semibold text-bronze hover:text-bronze/80 transition-colors cursor-pointer">
          Нэвтрэх
        </button>
      </p>
    </div>
  );
}

function PasswordStrength({ checks, percent, color, text, textColor }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className={`text-xs font-semibold ${textColor}`}>{text}</span>
        <span className="text-[10px] text-stone-400">{Math.round(percent)}%</span>
      </div>
      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className={`h-full rounded-full ${color}`}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <div className="grid grid-cols-5 gap-1">
        {checks.map((check: any) => (
          <div key={check.label} className="flex items-center gap-1.5 text-[11px]">
            {check.pass ? <Check className="w-3 h-3 text-green-500 shrink-0" /> : <X className="w-3 h-3 text-stone-300 shrink-0" />}
            <span className={check.pass ? 'text-green-700' : 'text-stone-400'}>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

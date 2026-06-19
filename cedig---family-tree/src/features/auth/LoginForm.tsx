"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";

const emailLoginSchema = z.object({
  email: z.string().email("Зөв и-мэйл хаяг оруулна уу"),
  password: z.string().min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой"),
  remember: z.boolean().optional(),
});

const phoneLoginSchema = z.object({
  phone: z.string().min(8, "Утасны дугаараа зөв оруулна уу"),
  countryCode: z.string(),
  password: z.string().min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой"),
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
  isSubmitting?: boolean;
}

export default function LoginForm({
  onEmailLogin,
  onPhoneLogin,
  onForgotPassword,
  onRegister,
  onGoogleLogin,
  onFacebookLogin,
  isSubmitting = false,
}: LoginFormProps) {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "facebook" | null
  >(null);

  const emailForm = useForm<EmailLoginData>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const phoneForm = useForm<PhoneLoginData>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: { phone: "", countryCode: "+976", password: "" },
  });

  const handleEmailSubmit = (data: EmailLoginData) => {
    onEmailLogin(data);
  };

  const handlePhoneSubmit = (data: PhoneLoginData) => {
    onPhoneLogin(data);
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    setSocialLoading(provider);
    if (provider === "google") onGoogleLogin();
    else onFacebookLogin();
  };

  const inputClasses =
    "w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all";
  const inputIconClasses =
    "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400";
  const tabClasses = (active: boolean) =>
    `relative px-5 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
      active
        ? "bg-ink text-white shadow-sm"
        : "text-stone-500 hover:text-ink hover:bg-stone-100"
    }`;

  const countryCodes = [
    { code: "+976", flag: "🇲🇳", label: "Монгол" },
    { code: "+86", flag: "🇨🇳", label: "Хятад" },
    { code: "+7", flag: "🇷🇺", label: "Орос" },
    { code: "+1", flag: "🇺🇸", label: "Америк" },
    { code: "+82", flag: "🇰🇷", label: "Солонгос" },
    { code: "+81", flag: "🇯🇵", label: "Япон" },
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
          onClick={() => handleSocialLogin("google")}
          disabled={!!socialLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all cursor-pointer disabled:opacity-50"
        >
          {socialLoading === "google" ? (
            <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
          ) : (
            <svg
              width="20px"
              height="20px"
              viewBox="-3 0 262 262"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              />
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              />
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              />
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              />
            </svg>
          )}
          Google
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          disabled={!!socialLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all cursor-pointer disabled:opacity-50"
        >
          {socialLoading === "facebook" ? (
            <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
          ) : (
            <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          Facebook
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
        <button
          type="button"
          onClick={() => setLoginMethod("email")}
          className={`flex-1 ${tabClasses(loginMethod === "email")}`}
        >
          <Mail className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          <span className="max-[321px]:hidden ">И-мэйл</span>
        </button>
        <button
          type="button"
          onClick={() => setLoginMethod("phone")}
          className={`flex-1 ${tabClasses(loginMethod === "phone")}`}
        >
          <Phone className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          <span className="max-[321px]:hidden ">Утас</span>
        </button>
      </div>

      {/* Email Login Form */}
      {loginMethod === "email" && (
        <form
          onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
          className="space-y-4"
        >
          <div className="relative">
            <Mail className={inputIconClasses} />
            <input
              type="email"
              placeholder="И-мэйл хаяг"
              {...emailForm.register("email")}
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
              type={showPassword ? "text" : "password"}
              placeholder="Нууц үг"
              {...emailForm.register("password")}
              className={`${inputClasses} pl-10 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
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
              <input
                type="checkbox"
                {...emailForm.register("remember")}
                className="w-4 h-4 rounded border-stone-300 text-bronze focus:ring-bronze/30 accent-bronze"
              />
              <span className="text-sm text-stone-600">Сануулах</span>
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm font-medium text-bronze hover:text-bronze/80 transition-colors cursor-pointer"
            >
              Нууц үг мартсан?
            </button>
          </div>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-pine text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:bg-pine/90 active:bg-pine/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Нэвтрэх
          </motion.button>
        </form>
      )}

      {/* Phone Login Form */}
      {loginMethod === "phone" && (
        <form
          onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-1.5">
              Утасны дугаар
            </label>
            <div className="flex gap-2">
              <select
                {...phoneForm.register("countryCode")}
                className="w-28 bg-white border border-stone-200 rounded-xl px-3 py-3.5 text-sm text-ink focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all cursor-pointer"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <Phone className={inputIconClasses} />
                <input
                  type="tel"
                  placeholder="Утасны дугаар"
                  {...phoneForm.register("phone")}
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
              type={showPassword ? "text" : "password"}
              placeholder="Нууц үг"
              {...phoneForm.register("password")}
              className={`${inputClasses} pl-10 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            {phoneForm.formState.errors.password && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {phoneForm.formState.errors.password.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm font-medium text-bronze hover:text-bronze/80 transition-colors cursor-pointer"
            >
              Нууц үг мартсан?
            </button>
          </div>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-pine text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:bg-pine/90 active:bg-pine/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Нэвтрэх
          </motion.button>
        </form>
      )}

      {/* Register Link */}
      <p className="text-center text-sm text-stone-500">
        Бүртгэл нээгээгүй юу?{" "}
        <button
          type="button"
          onClick={onRegister}
          className="font-semibold text-bronze hover:text-bronze/80 transition-colors cursor-pointer"
        >
          Бүртгэл үүсгэх
        </button>
      </p>
    </div>
  );
}

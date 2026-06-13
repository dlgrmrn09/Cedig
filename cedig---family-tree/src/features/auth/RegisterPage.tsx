"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import AuthLayout from "@/src/components/AuthLayout";
import RegisterForm from "./RegisterForm";
import { useAppStore } from "@/src/store";
import { Scroll, Users, BookOpen, Shield } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAppStore();

  const handleEmailRegister = (data: { username: string; firstName: string; lastName: string; email: string }) => {
    login(data.email, `${data.firstName} ${data.lastName}`, data.username);
    router.push("/onboarding");
  };

  const handlePhoneRegister = (data: { username: string; firstName: string; lastName: string; phone: string }) => {
    login(`${data.firstName} ${data.lastName}`, `${data.firstName} ${data.lastName}`, data.username);
    router.push("/onboarding");
  };

  const handleGoogleRegister = () => {
    login("google-user@cedig.mn", "Google Хэрэглэгч");
    router.push("/onboarding");
  };

  const handleFacebookRegister = () => {
    login("fb-user@cedig.mn", "Facebook Хэрэглэгч");
    router.push("/onboarding");
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
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-white">
              Гэр бүлийн түүхээ<br />
              хадгалж, өвлүүлээрэй
            </h1>
            <p className="text-base text-white/70 leading-relaxed max-w-md">
              Өвөг дээдсийнхээ түүхийг тоон архивт хадгалж, хойч үедээ өвлүүлээрэй.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: Scroll, label: 'Ургийн мод үүсгэх', desc: 'Гэр бүлийн модоо дүрслэн бүтээх' },
              { icon: BookOpen, label: 'Түүхэн мэдээлэл хадгалах', desc: 'Зураг, баримт, түүхэн өгүүллэг' },
              { icon: Users, label: 'Хамтран ажиллах', desc: 'Гэр бүлийн гишүүдийг урих' },
              { icon: Shield, label: 'Аюулгүй хадгалалт', desc: 'Таны өгөгдлийн нууцлал хамгаалагдана' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3 group"
              >
                <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white/20 transition-all">
                  <item.icon className="w-4 h-4 text-bronze" />
                </span>
                <div>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors block">
                    {item.label}
                  </span>
                  <span className="text-xs text-white/50">{item.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      }
      form={
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/5 border border-white/50 p-8 sm:p-10 max-h-[90vh] overflow-y-auto">
          <RegisterForm
            onEmailRegister={handleEmailRegister}
            onPhoneRegister={handlePhoneRegister}
            onLogin={() => router.push("/login")}
            onGoogleRegister={handleGoogleRegister}
            onFacebookRegister={handleFacebookRegister}
          />
        </div>
      }
    />
  );
}

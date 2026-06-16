"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Logo from "@/src/components/Logo";
import AuthBackground from "@/src/components/auth/AuthBackground";

interface AuthLayoutProps {
  hero?: React.ReactNode;
  form: React.ReactNode;
  className?: string;
}

export default function AuthLayout({
  hero,
  form,
  className = "",
}: AuthLayoutProps) {
  const router = useRouter();

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden flex flex-col lg:flex-row ${className}`}
    >
      <AuthBackground />

      {/* Mobile-only Header */}
      <header className="lg:hidden relative z-20 flex items-center justify-between px-5 py-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Буцах
        </button>
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <div className="absolute inset-0 bg-black/50 lg:bg-black/40" />
        </div>
      </header>

      {/* LEFT: Hero / Information Side */}
      <div className="hidden  relative z-10 w-full lg:w-1/2 lg:flex items-center justify-center min-h-[50vh] lg:min-h-screen p-8 lg:p-12">
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50 lg:bg-black/40" />
        <div className="relative z-10 w-full max-w-lg">
          {/* Desktop Back Button */}
          <div className="hidden lg:block mb-10">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Буцах
            </button>
          </div>
          {hero}
        </div>
      </div>

      {/* RIGHT: Form Side */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center min-h-screen bg-white lg:bg-vellum p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {form}
        </motion.div>
      </div>

      {/* reCAPTCHA container for Firebase Phone Auth */}
      <div id="recaptcha-container" />

      {/* Mobile Footer */}
      <footer className="lg:hidden relative z-20 flex items-center justify-between px-5 py-4 text-xs text-white/60 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <span>© 2026 CEDIG</span>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Нууцлалын бодлого
          </button>
          <span>•</span>
          <button
            onClick={() => router.push("/")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Тусламж
          </button>
        </div>
      </footer>
    </div>
  );
}

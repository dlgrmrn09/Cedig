"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Logo from "@/src/components/Logo";
import { motion } from "motion/react";
import ToastToaster from "@/src/components/ToastToaster";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import ClansOverview from "./ClansOverview";
import HowItWorks from "./HowItWorks";
import Footer from "./Footer";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative flex flex-col font-sans-ui text-ink bg-vellum selection:bg-bronze/30 transition-colors duration-300">
      <div className="absolute inset-0 ulzii-pattern opacity-30 pointer-events-none -z-10" />

      {/* Navigation Header */}
      <motion.nav
        id="landing-navbar"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 w-full h-20 bg-vellum/90 backdrop-blur-md border-b border-bronze/20 z-50 flex items-center"
      >
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Logo size={40} />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight text-ink">
              CEDIG
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 font-medium text-ink/80">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#features"
              className="hover:text-bronze transition-colors"
            >
              Боломжууд
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#how-it-works"
              className="hover:text-bronze transition-colors"
            >
              Заавар
            </motion.a>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              id="signin-btn"
              onClick={() => router.push("/login")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-pine text-vellum px-6 py-2.5 rounded-full font-semibold hover:opacity-95 transition-all shadow-md shadow-pine/10 cursor-pointer"
            >
              Нэвтрэх
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <HeroSection
        onStart={() => router.push("/register")}
        onJoin={() => router.push("/login")}
      />

      <FeaturesSection />
      <ClansOverview />
      <HowItWorks />
      <Footer />
      <ToastToaster />
    </div>
  );
}

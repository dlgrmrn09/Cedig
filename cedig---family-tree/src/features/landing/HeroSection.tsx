'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, PlayCircle, Users2 } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
} as const;

interface HeroSectionProps {
  onStart: () => void;
  onJoin: () => void;
}

export default function HeroSection({ onStart, onJoin }: HeroSectionProps) {
  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bronze/10 border border-bronze/20 text-bronze font-semibold text-xs tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bronze opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-bronze"></span>
              </span>
              Монгол Ургийн Мод ба Гэр Бүлийн Түүхийн Платформ
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-ink leading-[1.12]">
              Ургийн бичгээ <br />
              <span className="text-bronze italic font-normal">цахим</span> хэлбэрээр өвлүүлээрэй
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-ink/75 leading-relaxed max-w-lg">
              Бид таны гэр бүлийн түүх, өв соёлыг ирээдүй хойчдоо найдвартай хадгалахад тусална. Өөрийн удам угсаагаа судлан тогтоож, хамтдаа түүхээ бүтээгээрэй.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-2">
              <motion.button
                onClick={onStart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-bronze text-ink px-8 py-4 rounded-full font-bold text-lg hover:bg-bronze/90 transition-all shadow-lg shadow-bronze/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Эхлэх <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={onJoin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-ink/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-pine/5 transition-all flex items-center justify-center gap-2 text-ink cursor-pointer"
              >
                Join Tree <PlayCircle className="w-5 h-5 text-bronze" />
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="absolute inset-0 bg-bronze/10 blur-[130px] rounded-full scale-75" />
            <div className="relative bg-white/50 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-white/75 shadow-2xl w-full max-w-md">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-lg border border-bronze/20 bg-stone-900">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuARIUtR-fIirox7PBRfHVw-MZ_0nCPJaHNcYcJkylKJeKC8tVt6nhYFKmYGDVY21jcoRckPIF7KRguFqhSudeDmdUdZs78IOZzI9GiJKdS9iLnu3r8rZiVPZqfAhc9rFNNoEMG4U8z5OhcPfmX7cGfizRuwkbqRDgLMeVOrrGOGOfFIy3ixi2IEHnVC5y0zt9FCUDqVn968KGgs2_krtqnsIjVeKDJrj1wMENpcwVTfzIstdVEbvEDRONZHWseoEeOYxLoG6SFgXfIH"
                  alt="Family Tree Visualization"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-bronze/30 hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bronze/20 flex items-center justify-center">
                    <Users2 className="w-5 h-5 text-bronze" />
                  </div>
                  <div>
                    <p className="text-xs text-ink/50 font-medium">Нийт гишүүд</p>
                    <p className="font-bold text-ink">1,240+</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

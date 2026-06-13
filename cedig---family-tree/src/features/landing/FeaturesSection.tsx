'use client';

import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, TreePine, History, Shield } from 'lucide-react';

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

const features = [
  {
    icon: <TreePine className="w-8 h-8 text-bronze" />,
    title: 'Ургийн мод',
    desc: 'Хэдэн ч үеэр дамжсан өргөн хэмжээний ургийн мод босгох боломжтой, ухаалаг систем.'
  },
  {
    icon: <History className="w-8 h-8 text-bronze" />,
    title: 'Намтар хадгалах',
    desc: 'Гэр бүлийн гишүүн бүрийн түүх, амжилт, дурсамжуудыг дэлгэрэнгүй тэмдэглэн үлдээх.'
  },
  {
    icon: <BookOpen className="w-8 h-8 text-bronze" />,
    title: 'Баримт бичиг',
    desc: 'Түүхэн гэрчилгээ, шагнал урамшуулал, чухал бичиг баримтуудыг дижитал хэлбэрт шилжүүлэх.'
  },
  {
    icon: <Shield className="w-8 h-8 text-bronze" />,
    title: 'Хандалтын удирдлага',
    desc: 'Хувийн нууцлалыг чандлан сахиж, хэн ямар мэдээлэл харахыг бүрэн хянах систем.'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white/60">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-bronze font-bold tracking-widest uppercase text-sm">Онцлох боломжууд</h2>
          <p className="text-3xl sm:text-4xl font-display font-bold text-ink">
            Өөрийн өв соёлыг бүтээхэд хэрэгтэй бүх зүйл
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -6, boxShadow: "0 10px 30px -10px rgba(212, 166, 70, 0.15)" }}
              className="group p-8 rounded-2xl bg-vellum/40 border border-bronze/10 hover:border-bronze/35 transition-all"
            >
              <div className="w-14 h-14 bg-bronze/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-ink">{feat.title}</h3>
              <p className="text-ink/70 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

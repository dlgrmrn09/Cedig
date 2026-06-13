'use client';

import React from 'react';
import { motion } from 'motion/react';

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

const steps = [
  { num: '1', title: 'Ургийн мод үүсгэх', desc: 'Өөрийн бүртгэлийг үүсгэж, анхны модоо эхлүүлнэ.' },
  { num: '2', title: 'Гишүүд нэмэх', desc: 'Эцэг эх, ах дүүс болон бусад гишүүдийг бүртгэнэ.' },
  { num: '3', title: 'Урилга илгээх', desc: 'Гишүүддээ код илгээж хамтдаа хөгжүүлнэ.' },
  { num: '4', title: 'Түүхээ мөнхлөх', desc: 'Түүх, зураг, баримтаар баяжуулж хадгална.' }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 space-y-2"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink">Хэрхэн ажилладаг вэ?</h2>
          <p className="text-ink/60">Та ердөө 4 алхмаар гэр бүлийнхээ түүхийг мөнхлөх боломжтой</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <div className="hidden lg:block absolute top-[44px] left-[15%] w-[70%] h-0.5 bg-bronze/20 -z-10" />
          {steps.map((st, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="flex flex-col items-center text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 rounded-full bg-bronze text-ink flex items-center justify-center text-2xl font-bold mb-6 ring-8 ring-vellum transition-transform shadow-md cursor-pointer"
              >
                {st.num}
              </motion.div>
              <h3 className="text-lg font-bold mb-2 text-ink">{st.title}</h3>
              <p className="text-sm text-ink/65 px-4">{st.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

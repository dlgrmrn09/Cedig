'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Users2, ScrollText } from 'lucide-react';

const clans = [
  {
    name: 'Сартуул',
    nameLatin: 'Sartuul',
    description: 'Сартуул овог нь Монголын нэрт овгуудын нэг бөгөөд эртний түүхтэй. Энэ овгийн төлөөлөгчид Монголын түүх, соёл, улс төрийн амьдралд чухал үүрэг гүйцэтгэсэн. Тэдний уламжлалт бичиг соёлын өв дурсгалууд өнөөг хүртэл хадгалагдан үлдсэн.',
    highlights: ['Эртний түүхтэй овог', 'Баян бичгийн өв', 'Олон үеийн уламжлал'],
    icon: <ScrollText className="w-6 h-6" />
  },
  {
    name: 'Боржигин',
    nameLatin: 'Borgijin',
    description: 'Боржигин овог нь Монголын хамгийн алдартай овгуудын нэг бөгөөд Чингис хааны алтан ургийн овог юм. Энэ овгийн түүх, намтар нь Монголын түүхэн хөгжилтэй салшгүй холбоотой бөгөөд олон зууны түүхтэй.',
    highlights: ['Алтан ургийн овог', 'Түүхэн баялаг өв', 'Олон улсын хүлээн зөвшөөрөл'],
    icon: <Users2 className="w-6 h-6" />
  }
];

export default function ClansOverview() {
  return (
    <section className="py-24 bg-vellum/60 border-t border-bronze/10 relative overflow-hidden">
      <div className="absolute inset-0 ulzii-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Ornamental top divider */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="h-px w-16 bg-bronze/30" />
          <div className="w-2 h-2 rotate-45 bg-bronze/40" />
          <div className="h-px w-8 bg-bronze/20" />
          <span className="text-bronze font-bold tracking-widest uppercase text-sm">Ургийн овгууд</span>
          <div className="h-px w-8 bg-bronze/20" />
          <div className="w-2 h-2 rotate-45 bg-bronze/40" />
          <div className="h-px w-16 bg-bronze/30" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink">
            Монголын уламжлалт овгууд
          </h2>
          <p className="text-ink/60 max-w-2xl mx-auto">
            Монгол орны түүхэн овгуудын намтар, удам угсааг судлан тогтоож, ирээдүй хойч үедээ өвлүүлэн үлдээх нь бидний эрхэм зорилго.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {clans.map((clan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
              whileHover={{ y: -4 }}
              className="bg-white p-8 sm:p-10 rounded-3xl border border-bronze/15 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-bronze/5 rounded-bl-[100px]" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-bronze/10 rounded-2xl flex items-center justify-center text-bronze">
                  {clan.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-ink">{clan.name}</h3>
                  <p className="text-bronze font-semibold text-sm tracking-wider">{clan.nameLatin}</p>
                </div>
              </div>

              <p className="text-ink/70 text-sm leading-relaxed mb-8">
                {clan.description}
              </p>

              <div className="space-y-3">
                {clan.highlights.map((hl, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-bronze" />
                    <span className="text-sm text-ink/80 font-medium">{hl}</span>
                  </div>
                ))}
              </div>

              {/* Ornamental bottom accent */}
              <div className="mt-8 pt-6 border-t border-bronze/10 flex items-center gap-2">
                <div className="h-px flex-grow bg-gradient-to-r from-bronze/30 to-transparent" />
                <div className="w-2 h-2 rotate-45 bg-bronze/30" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ornamental bottom divider */}
        <div className="flex items-center justify-center gap-4 mt-16">
          <div className="h-px w-16 bg-bronze/20" />
          <div className="w-2 h-2 rotate-45 bg-bronze/30" />
          <div className="h-px w-32 bg-bronze/10" />
          <div className="w-2 h-2 rotate-45 bg-bronze/30" />
          <div className="h-px w-16 bg-bronze/20" />
        </div>
      </div>
    </section>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '@/src/store';
import { CheckCircle, TreePine } from 'lucide-react';

const CONFETTI_COLORS = ['#C4956A', '#2B4C3B', '#8B3A2A', '#F5F0E8'];

export default function SuccessPage() {
  const router = useRouter();
  const { completeAuthFlow } = useAppStore();
  const [stage, setStage] = useState<'check' | 'growing' | 'complete'>('check');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('growing'), 600);
    const t2 = setTimeout(() => setStage('complete'), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const confetti = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      key: i,
      color: CONFETTI_COLORS[i % 4],
      left: `${10 + ((i * 37 + 13) % 80)}%`,
      top: `${10 + ((i * 53 + 7) % 80)}%`,
      delay: (i * 0.1) % 0.5,
      duration: 2 + (i % 3),
      repeatDelay: 3 + (i % 4),
      yOffset: -40 - (i % 6) * 10,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink flex items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice">
          <circle cx="200" cy="300" r="350" fill="#C4956A" />
          <circle cx="600" cy="500" r="300" fill="#2B4C3B" />
          <circle cx="400" cy="800" r="250" fill="#C4956A" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto text-center">
        {/* Animated Tree Illustration */}
        <div className="mb-10">
          <svg width="200" height="240" viewBox="0 0 200 240" className="mx-auto">
            {/* Ground */}
            <motion.rect
              x="60" y="220" width="80" height="4" rx="2" fill="#C4956A"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              style={{ transformOrigin: 'center' }}
            />
            {/* Trunk */}
            <motion.rect
              x="94" y="160" width="12" height="60" rx="3" fill="#C4956A"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
              style={{ transformOrigin: 'bottom' }}
            />

            {/* Branches and leaves - animated growth */}
            {[
              { cx: 100, cy: 150, r: 28, delay: 0.6 },
              { cx: 80, cy: 130, r: 22, delay: 0.8 },
              { cx: 120, cy: 130, r: 22, delay: 0.9 },
              { cx: 100, cy: 110, r: 24, delay: 1.0 },
              { cx: 85, cy: 95, r: 18, delay: 1.1 },
              { cx: 115, cy: 95, r: 18, delay: 1.15 },
              { cx: 100, cy: 80, r: 16, delay: 1.2 },
            ].map((leaf, i) => (
              <motion.circle
                key={i}
                cx={leaf.cx}
                cy={leaf.cy}
                r={leaf.r}
                fill={stage === 'complete' ? '#2B4C3B' : '#C4956A'}
                fillOpacity={stage === 'complete' ? 0.9 : 0.4}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: leaf.delay }}
                style={{ transformOrigin: `${leaf.cx}px ${leaf.cy}px` }}
              />
            ))}

            {/* Small leaves/fruits */}
            {stage === 'complete' && [85, 100, 115].map((x, i) => (
              <motion.circle
                key={`fruit-${i}`}
                cx={x} cy={70 - i * 8} r={4}
                fill="#C4956A"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.8 + i * 0.15, type: 'spring', stiffness: 300 }}
              />
            ))}
          </svg>
        </div>

        {/* Check Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: stage === 'check' ? 1 : stage === 'growing' ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="w-20 h-20 rounded-full bg-pine/20 mx-auto flex items-center justify-center mb-6"
        >
          <CheckCircle className={`w-10 h-10 ${stage === 'complete' ? 'text-green-400' : 'text-bronze'}`} />
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-3"
        >
          <h1 className="text-4xl font-bold text-white">
            {stage === 'complete' ? 'Амжилттай!' : 'Түр хүлээнэ үү...'}
          </h1>
          <p className="text-lg text-white/60">
            {stage === 'check'
              ? 'Таны бүртгэл баталгаажиж байна...'
              : stage === 'growing'
              ? 'Таны ургийн мод ургаж байна...'
              : 'Таны бүртгэл амжилттай баталгаажлаа.'}
          </p>
        </motion.div>

        {/* Confetti-like dots */}
        {stage === 'complete' && (
          <div className="absolute inset-0 pointer-events-none">
            {confetti.map((c) => (
              <motion.div
                key={c.key}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: c.color,
                  left: c.left,
                  top: c.top,
                }}
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1, 0],
                  y: [-20, c.yOffset],
                }}
                transition={{
                  duration: c.duration,
                  delay: c.delay,
                  repeat: Infinity,
                  repeatDelay: c.repeatDelay,
                }}
              />
            ))}
          </div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: stage === 'complete' ? 1 : 0, y: stage === 'complete' ? 0 : 10 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10"
        >
          {stage === 'complete' && (
            <motion.button
              onClick={() => { completeAuthFlow(); router.push('/onboarding'); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-bronze text-ink rounded-xl font-semibold text-base shadow-xl shadow-bronze/20 hover:bg-bronze/90 transition-all cursor-pointer"
            >
              <TreePine className="w-5 h-5" />
              Ургийн Мод Үүсгэх
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

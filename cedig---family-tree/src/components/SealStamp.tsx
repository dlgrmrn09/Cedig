'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SealStampProps {
  show: boolean;
  onComplete?: () => void;
}

export default function SealStamp({ show, onComplete }: SealStampProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 50);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 850);
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, rotate: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, mass: 0.8 }}
            className="w-28 h-28 border-[3px] border-cinnabar bg-cinnabar/10 backdrop-blur-sm flex items-center justify-center rounded-sm"
            style={{ boxShadow: '0 0 0 2px #8B3A2A inset' }}
          >
            <span className="text-cinnabar font-bold text-[10px] leading-tight text-center px-1 tracking-widest font-mono-ui">
              БАТАЛГАА
              <br />
              <span className="text-[8px] tracking-[0.3em]">СЕАЛ</span>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

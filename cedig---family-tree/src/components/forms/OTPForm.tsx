'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Loader2, Mail, Phone, Clock, ArrowLeft } from 'lucide-react';

interface OTPFormProps {
  onSubmit: (otp: string) => void;
  onResend: () => void;
  onChangeDestination: () => void;
  onBack: () => void;
  destination: string;
  isEmail: boolean;
  countdown: number;
  setCountdown: (val: number) => void;
}

export default function OTPForm({
  onSubmit,
  onResend,
  onChangeDestination,
  onBack,
  destination,
  isEmail,
  countdown,
  setCountdown,
}: OTPFormProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const canResend = countdown <= 0;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const id = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    setOtp((prev) => {
      const next = [...prev];
      next[index] = value.slice(-1);
      if (value && index < 5) {
        requestAnimationFrame(() => inputRefs.current[index + 1]?.focus());
      }
      return next;
    });
  }, []);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    setOtp((prev) => {
      if (e.key === 'Backspace' && !prev[index] && index > 0) {
        requestAnimationFrame(() => inputRefs.current[index - 1]?.focus());
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        requestAnimationFrame(() => inputRefs.current[index - 1]?.focus());
      }
      if (e.key === 'ArrowRight' && index < 5) {
        requestAnimationFrame(() => inputRefs.current[index + 1]?.focus());
      }
      return prev;
    });
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setOtp(() => {
      const newOtp = Array(6).fill('');
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      const focusIndex = Math.min(pasted.length, 5);
      requestAnimationFrame(() => inputRefs.current[focusIndex]?.focus());
      return newOtp;
    });
  }, []);

  const handleSubmit = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;
    setLoading(true);
    try {
      await Promise.resolve(onSubmit(code));
    } finally {
      setLoading(false);
    }
  };

  const handleResendAction = () => {
    setCountdown(120);
    onResend();
    setOtp(Array(6).fill(''));
    requestAnimationFrame(() => inputRefs.current[0]?.focus());
  };

  const isComplete = otp.every((d) => d !== '');
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="space-y-8">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-ink transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Буцах
      </button>

      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-14 h-14 rounded-2xl bg-pine/10 mx-auto flex items-center justify-center"
        >
          {isEmail ? <Mail className="w-7 h-7 text-pine" /> : <Phone className="w-7 h-7 text-pine" />}
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold text-ink">Код илгээгдсэн</h1>
          <p className="text-sm text-stone-500 mt-1">
            {isEmail ? 'И-мэйл хаяг' : 'Утасны дугаар'} руу 6 оронтой код илгээлээ:
          </p>
          <p className="text-sm font-semibold text-bronze mt-0.5">{destination}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-11 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold text-ink bg-white border-2 rounded-xl outline-none transition-all ${
                  digit ? 'border-bronze shadow-sm shadow-bronze/10' : 'border-stone-200 hover:border-stone-300'
                } focus:border-bronze focus:ring-2 focus:ring-bronze/15`}
                autoComplete="one-time-code"
                aria-label={`OTP digit ${index + 1}`}
              />
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-stone-400" />
          {canResend ? (
            <button
              type="button"
              onClick={handleResendAction}
              className="font-semibold text-bronze hover:text-bronze/80 transition-colors cursor-pointer"
            >
              Код дахин илгээх
            </button>
          ) : (
            <span className="text-stone-500">
              Дахин илгээх: <span className="font-semibold text-ink">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
            </span>
          )}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onChangeDestination}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors cursor-pointer underline underline-offset-2"
          >
            {isEmail ? 'Өөр и-мэйл хаяг' : 'Өөр утасны дугаар'} ашиглах
          </button>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !isComplete}
        whileHover={isComplete ? { scale: 1.01 } : {}}
        whileTap={isComplete ? { scale: 0.98 } : {}}
        className="w-full bg-pine text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Баталгаажуулж байна...</>
        ) : (
          'Баталгаажуулах'
        )}
      </motion.button>

      {isComplete && !loading && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs text-stone-400"
        >
          Баталгаажуулах товчийг дарна уу
        </motion.p>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAppStore, AppNotification } from '@/lib/store';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ToastToaster() {
  const notifications = useAppStore((state) => state.notifications);
  const [activeToasts, setActiveToasts] = useState<AppNotification[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());

  // Populate seenIds initially on mounting, so we don't display retro-toasts for pre-existing notifications
  useEffect(() => {
    const initialIds = new Set(notifications.map(n => n.id));
    seenIdsRef.current = initialIds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Look for notifications that are not in seenIdsRef
    const newNotifications = notifications.filter(n => !seenIdsRef.current.has(n.id));
    
    if (newNotifications.length > 0) {
      // Add them to activeToasts
      setActiveToasts(prev => {
        // filter duplicates
        const filteredNew = newNotifications.filter(newN => !prev.some(t => t.id === newN.id));
        return [...prev, ...filteredNew];
      });

      // Track them as seen
      newNotifications.forEach(n => seenIdsRef.current.add(n.id));
    }
  }, [notifications]);

  // Handle toast removal
  const handleRemoveToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[99999] flex flex-col gap-3 max-w-sm w-[calc(100%-2rem)] sm:w-full pointer-events-none select-none">
      <AnimatePresence>
        {activeToasts.map((toast) => {
          return (
            <ToastItem 
              key={toast.id} 
              toast={toast} 
              onClose={() => handleRemoveToast(toast.id)} 
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: AppNotification; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Determine icons and colors matching theme
  const config = {
    success: {
      bg: 'bg-[#FCFAF2] border-emerald-500/40 text-ink',
      progressBg: 'bg-emerald-500',
      icon: <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
    },
    warn: {
      bg: 'bg-[#FCFAF2] border-rose-500/40 text-ink',
      progressBg: 'bg-rose-500',
      icon: <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
    },
    info: {
      bg: 'bg-pine border-bronze/30 text-vellum',
      progressBg: 'bg-bronze',
      icon: <Info className="w-5 h-5 shrink-0 text-bronze" />
    }
  }[toast.type || 'info'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.95, transition: { duration: 0.15 } }}
      className={`pointer-events-auto rounded-xl border p-4 shadow-xl flex items-start gap-3 relative overflow-hidden transition-all duration-300 max-w-sm w-full ${config.bg}`}
    >
      {/* Icon */}
      {config.icon}

      {/* Content */}
      <div className="flex-grow space-y-1 pr-4">
        <h4 className="font-bold text-xs leading-none tracking-wide uppercase font-sans mt-0.5">
          {toast.title}
        </h4>
        <p className="text-[11px] leading-relaxed opacity-90 font-medium">
          {toast.message}
        </p>
      </div>

      {/* Dismiss Button */}
      <button 
        onClick={onClose}
        className="text-ink/60 hover:text-rose-500 hover:bg-black/5 p-1 rounded transition-colors absolute right-2 top-2 shrink-0 cursor-pointer"
        style={{ color: toast.type === 'info' ? '#F5F0E8' : undefined }}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Custom Progress slide bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 overflow-hidden">
        <motion.div 
          className={`h-full ${config.progressBg}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 4.5, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}

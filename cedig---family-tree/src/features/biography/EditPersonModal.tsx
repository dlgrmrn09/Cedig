"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import type { Person } from "@/src/types/person";
import { personToFormData } from "@/src/types/personFormData";
import PersonForm, {
  type PersonFormData,
  type AvatarState,
} from "@/src/components/PersonForm";

interface EditPersonModalProps {
  open: boolean;
  onClose: () => void;
  person: Person;
  onSave: (id: string, data: Partial<Person>) => Promise<void>;
}

function formDataToPersonUpdates(form: PersonFormData): Partial<Person> {
  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(form)) {
    if (value === undefined || value === null || value === "") continue;
    updates[key] = value;
  }
  return updates as Partial<Person>;
}

export default function EditPersonModal({
  open,
  onClose,
  person,
  onSave,
}: EditPersonModalProps) {
  const handleSubmit = async (
    formData: PersonFormData,
    avatar: AvatarState,
  ) => {
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) return;

    const updates = formDataToPersonUpdates(formData);

    // Handle avatar changes
    if (avatar.action === "remove") {
      updates.avatarUrl = undefined;
      (updates as Record<string, unknown>).avatarUrl = null;
    } else if (avatar.action === "change") {
      // URL was set in PersonForm via upload
      const url = (formData as unknown as Record<string, unknown>).avatarUrl;
      if (url) updates.avatarUrl = url as string;
    }
    // "none" = no change — don't include avatarUrl in updates

    await onSave(person.id, updates as Partial<Person>);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col"
            key={person.id}
          >
            {/* ── Top bar ────────────────────────────────────── */}
            <div className="shrink-0 flex items-center justify-between px-6 py-3.5 bg-pine text-white">
              <span className="font-serif italic font-bold text-sm">
                {person.firstName} {person.lastName} &mdash; Edit
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── PersonForm ─────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
              <PersonForm
                mode="edit"
                initialData={personToFormData(person)}
                existingAvatarUrl={person.avatarUrl}
                onCancel={onClose}
                onSubmit={handleSubmit}
                saveLabel=" хадгалах"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

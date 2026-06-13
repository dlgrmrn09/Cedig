"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import type { Person } from "@/src/types/person";
import type { PersonFormData } from "@/src/types/personFormData";
import { personToFormData } from "@/src/types/personFormData";
import { PERSON_FIELDS } from "@/src/config/personFields";
import type { PersonFieldConfig } from "@/src/config/personFields";

interface EditPersonModalProps {
  open: boolean;
  onClose: () => void;
  person: Person;
  onSave: (id: string, data: Partial<Person>) => void;
}

function FormField({
  field,
  value,
  onChange,
}: {
  field: PersonFieldConfig;
  value: string | number | undefined;
  onChange: (val: string | number | undefined) => void;
}) {
  const baseClass = "w-full bg-white border border-stone-300 rounded p-2 text-stone-900";

  if (field.type === "textarea") {
    return (
      <div className="space-y-1 sm:col-span-2">
        <label className="text-stone-500 block uppercase text-[10px]">{field.label}</label>
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClass} h-24 font-sans resize-none`}
          placeholder={field.placeholder}
        />
      </div>
    );
  }

  if (field.key === "gender") {
    return (
      <div className="space-y-1">
        <label className="text-stone-500 block uppercase text-[10px]">Хүйс</label>
        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 gap-1">
          <button
            type="button"
            onClick={() => onChange("male")}
            className={`flex-grow text-center py-2 rounded-lg font-bold text-xs ${value === "male" ? "bg-pine text-white" : "text-ink/70"}`}
          >
            Эрэгтэй
          </button>
          <button
            type="button"
            onClick={() => onChange("female")}
            className={`flex-grow text-center py-2 rounded-lg font-bold text-xs ${value === "female" ? "bg-pine text-white" : "text-ink/70"}`}
          >
            Эмэгтэй
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="text-stone-500 block uppercase text-[10px]">{field.label}</label>
      <input
        type={field.type === "number" ? "number" : "text"}
        required={field.required}
        placeholder={field.placeholder}
        min={field.type === "number" ? 1800 : undefined}
        max={field.type === "number" ? 2100 : undefined}
        value={value ?? ""}
        onChange={(e) => {
          if (field.type === "number") {
            onChange(parseInt(e.target.value) || 0);
          } else {
            onChange(e.target.value);
          }
        }}
        className={baseClass}
      />
    </div>
  );
}

function fieldRows(fields: PersonFieldConfig[]): PersonFieldConfig[][] {
  const rows: PersonFieldConfig[][] = [];
  let i = 0;
  while (i < fields.length) {
    const field = fields[i];
    if (field.type === "textarea") {
      rows.push([field]);
      i++;
    } else if (i + 1 < fields.length && fields[i + 1].type !== "textarea") {
      rows.push([fields[i], fields[i + 1]]);
      i += 2;
    } else {
      rows.push([fields[i]]);
      i++;
    }
  }
  return rows;
}

const EDIT_FIELDS = PERSON_FIELDS.filter(
  (f) => f.key !== "awards"
);

export default function EditPersonModal({ open, onClose, person, onSave }: EditPersonModalProps) {
  const [form, setForm] = useState<PersonFormData>(() => personToFormData(person));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName?.trim() || !form.lastName?.trim()) return;
    onSave(person.id, form as unknown as Partial<Person>);
    onClose();
  };

  const handleChange = (key: keyof PersonFormData, val: string | number | undefined) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const rows = fieldRows(EDIT_FIELDS);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-[#FAF6EE] max-w-lg w-full p-5 md:p-6 rounded-xl border-4 border-[#32231A] shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-stone-600 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <h3 className="font-serif italic font-bold text-lg text-[#32231A] border-b border-[#735c00]/20 pb-1.5">
                📝 Түүхэн өв, намтарыг засварлах
              </h3>

              {rows.map((row, idx) => (
                <div key={idx} className={`grid grid-cols-1 ${row.length === 2 ? "sm:grid-cols-2" : ""} gap-3`}>
                  {row.map((field) => (
                    <FormField
                      key={field.key}
                      field={field}
                      value={form[field.key] as string | number | undefined}
                      onChange={(val) => handleChange(field.key, val)}
                    />
                  ))}
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-[#3B291D] hover:bg-stone-800 text-white font-bold py-2.5 rounded-lg uppercase tracking-wider text-xs"
              >
                ✓ Өөрчлөлтийг баталгаажуулах
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

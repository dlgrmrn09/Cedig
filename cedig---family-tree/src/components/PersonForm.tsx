"use client";

import React, { useState } from "react";
import type { PersonFormData } from "@/src/types/personFormData";
import { PERSON_SECTIONS } from "@/src/config/personFields";
import type { PersonFieldConfig } from "@/src/config/personFields";
import VoiceHoldButton from "@/src/components/VoiceHoldButton";
import AvatarUpload from "@/src/components/shared/AvatarUpload";

// ── Types ──────────────────────────────────────────────────────────────────

export type { PersonFormData };

export interface PersonFormProps {
  mode: "add" | "edit";
  initialData: PersonFormData;
  existingAvatarUrl?: string | null;
  onCancel: () => void;
  onSubmit: (data: PersonFormData, avatar: AvatarState) => Promise<void>;
  headerTitle?: string;
  headerSubtitle?: React.ReactNode;
  saveLabel?: string;
}

export interface AvatarState {
  file: File | null;
  previewUrl: string | null;
  action: "none" | "change" | "remove";
}

export const INITIAL_FORM_DATA: PersonFormData = {
  firstName: "",
  lastName: "",
  surname: "",
  clanName: "",
  birthPlace: "",
  residence: "",
  citizenship: "",
  phone: "",
  email: "",
  title: "",
  employment: "",
  birthYear: new Date().getFullYear(),
  birthDate: "",
  deathDate: "",
  gender: "male",
  zodiacSign: "",
  occupation: "",
  education: "",
  biography: "",
  notes: "",
  awards: [],
};

// ── Field groups ──────────────────────────────────────────────────────────

interface FieldGroup {
  label: string;
  description?: string;
  fields: PersonFieldConfig[];
}

// Fields rendered in the header — exclude them from sections
const HEADER_FIELD_KEYS = new Set(["firstName", "lastName", "clanName"]);

const FIELD_GROUPS: FieldGroup[] = PERSON_SECTIONS.map((s) => ({
  label: s.label,
  fields: s.fields.filter((f) => !HEADER_FIELD_KEYS.has(f.key)),
}));

// Add birthYear field manually since it's not in PERSON_FIELDS config
const BIRTH_YEAR_FIELD: PersonFieldConfig = {
  key: "birthYear",
  label: "Төрсөн он",
  type: "number",
  required: true,
  placeholder: "1980",
  section: "personal",
};

// Merge birthYear into the first group (personal) after gender
FIELD_GROUPS[0] = {
  ...FIELD_GROUPS[0],
  fields: [
    ...FIELD_GROUPS[0].fields.slice(0, 1), // gender (firstName/lastName/clanName already removed)
    BIRTH_YEAR_FIELD,
    ...FIELD_GROUPS[0].fields.slice(1),    // rest
  ],
};

// ── FormField ─────────────────────────────────────────────────────────────

function FormField({
  field,
  value,
  onChange,
}: {
  field: PersonFieldConfig;
  value: string | number | undefined;
  onChange: (val: string | number | undefined) => void;
}) {
  const id = `field-${field.key}`;

  if (field.type === "textarea") {
    return (
      <div className="space-y-1.5 col-span-full">
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-stone-500 uppercase tracking-wide"
        >
          {field.label}
          {field.required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
        <textarea
          id={id}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.key === "biography" ? 6 : 3}
          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/10 transition-all resize-none"
        />
        {field.key === "biography" && (
          <div className="flex justify-between items-center text-xs text-stone-400">
            <span>{typeof value === "string" ? value.length : 0} тэмдэгт</span>
            <VoiceHoldButton
              onTranscript={(text) => {
                const current = typeof value === "string" ? value : "";
                onChange(current + (current ? " " : "") + text);
              }}
            />
          </div>
        )}
      </div>
    );
  }

  if (field.key === "gender") {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide">
          {field.label}
          {field.required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 gap-1">
          <GenderButton
            active={value === "male"}
            onClick={() => onChange("male")}
            label="Эр"
          />
          <GenderButton
            active={value === "female"}
            onClick={() => onChange("female")}
            label="Эм"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-stone-500 uppercase tracking-wide"
      >
        {field.label}
        {field.required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={field.type === "number" ? "number" : "text"}
        required={field.required}
        placeholder={field.placeholder}
        min={field.key === "birthYear" ? 1800 : undefined}
        max={field.key === "birthYear" ? 2100 : undefined}
        value={value ?? ""}
        onChange={(e) => {
          if (field.type === "number") {
            const parsed = parseInt(e.target.value);
            onChange(isNaN(parsed) ? 0 : parsed);
          } else {
            onChange(e.target.value);
          }
        }}
        className="w-full h-10 bg-white border border-stone-200 rounded-xl px-4 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/10 transition-all"
      />
    </div>
  );
}

function GenderButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-grow text-center py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
        active
          ? "bg-pine text-white shadow-sm"
          : "text-stone-400 hover:text-stone-600 hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────

function SectionHeader({
  label,
  description,
}: {
  label: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
        {label}
      </h2>
      {description && (
        <p className="text-[11px] text-stone-400/70 mt-0.5 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────

export default function PersonForm({
  mode,
  initialData,
  existingAvatarUrl,
  onCancel,
  onSubmit,
  headerTitle,
  headerSubtitle,
  saveLabel,
}: PersonFormProps) {
  const [form, setForm] = useState<PersonFormData>(initialData);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (key: keyof PersonFormData, val: string | number | undefined) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleFileSelect = (file: File) => {
    setAvatarFile(file);
    setRemoveAvatar(false);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
  };

  const handleCancelRemove = () => {
    setRemoveAvatar(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    let uploadUrl: string | undefined;
    if (avatarFile) {
      setUploadingAvatar(true);
      try {
        const { api } = await import("@/src/lib/api");
        const fd = new FormData();
        fd.append("file", avatarFile);
        fd.append("folder", "avatars");
        const result = await api.upload<{ url: string }>("/uploads/file", fd);
        uploadUrl = result.url;
      } catch {
        // Upload failed — continue without avatar
      } finally {
        setUploadingAvatar(false);
      }
    }

    const avatar: AvatarState = {
      file: avatarFile,
      previewUrl: avatarPreview,
      action: removeAvatar ? "remove" : avatarFile ? "change" : "none",
    };

    // Merge upload URL into form data for convenience
    const finalData = { ...form };
    if (uploadUrl) {
      (finalData as Record<string, unknown>).avatarUrl = uploadUrl;
    } else if (removeAvatar) {
      (finalData as Record<string, unknown>).avatarUrl = null;
    }

    try {
      await onSubmit(finalData, avatar);
    } catch {
      // Parent handles error UX
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col min-h-0"
      noValidate
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-5 border-b border-stone-200/80 bg-white/80 backdrop-blur">
        <div className="flex items-start gap-5">
          <AvatarUpload
            currentUrl={existingAvatarUrl}
            previewUrl={avatarPreview}
            isUploading={uploadingAvatar}
            onFileSelect={handleFileSelect}
            onRemove={handleRemoveAvatar}
            onCancelRemove={handleCancelRemove}
            isRemoved={removeAvatar}
            size={80}
            disabled={saving}
          />

          <div className="flex-1 space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                field={{
                  key: "firstName",
                  label: "Овог",
                  type: "text",
                  required: true,
                  placeholder: "Овог",
                  section: "personal",
                }}
                value={form.firstName}
                onChange={(v) => handleChange("firstName", v)}
              />
              <FormField
                field={{
                  key: "lastName",
                  label: "Нэр",
                  type: "text",
                  required: true,
                  placeholder: "Нэр",
                  section: "personal",
                }}
                value={form.lastName}
                onChange={(v) => handleChange("lastName", v)}
              />
            </div>
            <FormField
              field={{
                key: "clanName",
                label: "Ургийн овог",
                type: "text",
                required: true,
                placeholder: "Ургийн овог",
                section: "personal",
              }}
              value={form.clanName}
              onChange={(v) => handleChange("clanName", v)}
            />
          </div>
        </div>

        {headerTitle && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-serif font-bold text-stone-800">
              {headerTitle}
            </span>
          </div>
        )}

        {headerSubtitle && (
          <div className="mt-1 text-xs text-stone-500">{headerSubtitle}</div>
        )}
      </div>

      {/* ── Body — scrollable sections ─────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-8">
        {FIELD_GROUPS.map((group, gi) => (
          <section key={gi}>
            <SectionHeader label={group.label} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              {group.fields.map((field) => (
                <FormField
                  key={field.key}
                  field={field}
                  value={form[field.key] as string | number | undefined}
                  onChange={(val) => handleChange(field.key, val)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ── Footer — sticky ──────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-4 border-t border-stone-200/80 bg-white/80 backdrop-blur flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-40"
        >
          Цуцлах
        </button>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-pine text-white text-sm font-semibold hover:bg-pine/90 active:bg-pine/80 transition-all shadow-sm shadow-pine/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                {uploadingAvatar ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Зураг байршуулж байна...
                  </>
                ) : (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Хадгалж байна...
                  </>
                )}
              </>
            ) : (
              saveLabel || (mode === "add" ? "Гишүүн нэмэх" : "Өөрчлөлтийг хадгалах")
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

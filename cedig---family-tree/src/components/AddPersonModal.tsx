"use client";

import React, { useState, useRef } from "react";
import { useAppStore, Person } from "@/lib/store";
import SealStamp from "@/src/components/SealStamp";
import { X, FolderPlus, Upload } from "lucide-react";
import { PERSON_FIELDS } from "@/src/config/personFields";
import type { PersonFieldConfig } from "@/src/config/personFields";
import type { PersonFormData } from "@/src/types/personFormData";
import { api } from "@/src/lib/api";
import VoiceRecorder from "@/src/components/VoiceRecorder";
import Image from "next/image";
const FORM_FIELDS = PERSON_FIELDS.filter((f) => f.key !== "awards");

const initialForm: PersonFormData = {
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
  birthYear: 19801,
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

function FormField({
  field,
  value,
  onChange,
}: {
  field: PersonFieldConfig;
  value: string | number | undefined;
  onChange: (val: string | number | undefined) => void;
}) {
  const baseClass =
    "w-full bg-white border border-ink/15 rounded-xl p-3 text-sm focus:outline-none focus:border-bronze";

  if (field.type === "textarea") {
    return (
      <div className="space-y-1">
        <label className="text-stone-400 font-bold uppercase tracking-wider block text-xs">
          {field.label}{" "}
          {field.required && <span className="text-rose-500">*</span>}
        </label>
        <textarea
          placeholder={field.placeholder}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClass} h-24 resize-none`}
        />
        {field.key === "biography" && (
          <div className="flex justify-end">
            <VoiceRecorder
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
      <div className="space-y-1">
        <label className="text-stone-400 font-bold uppercase tracking-wider block text-xs">
          Хүйс
        </label>
        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 gap-1">
          <button
            type="button"
            onClick={() => onChange("male")}
            className={`flex-grow text-center py-2 rounded-lg font-bold text-sm ${value === "male" ? "bg-pine text-white" : "text-ink/70"}`}
          >
            Эрэгтэй
          </button>
          <button
            type="button"
            onClick={() => onChange("female")}
            className={`flex-grow text-center py-2 rounded-lg font-bold text-sm ${value === "female" ? "bg-pine text-white" : "text-ink/70"}`}
          >
            Эмэгтэй
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="text-stone-400 font-bold uppercase tracking-wider block text-xs">
        {field.label}{" "}
        {field.required && <span className="text-rose-500">*</span>}
      </label>
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

export default function AddPersonModal() {
  const {
    people,
    familyTreeId,
    addingRelationToId,
    addingRelationType,
    setAddingRelation,
    addPersonAsync,
    addNotification,
  } = useAppStore();

  const [form, setForm] = useState<PersonFormData>(() => ({
    ...initialForm,
    gender: (() => {
      if (addingRelationType === "father") return "male";
      if (addingRelationType === "mother") return "female";
      const anchorPerson = people.find((p) => p.id === addingRelationToId);
      if (addingRelationType === "spouse" && anchorPerson) {
        return anchorPerson.gender === "male" ? "female" : "male";
      }
      return "male";
    })(),
  }));

  const [showSeal, setShowSeal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const anchorPerson = addingRelationToId
    ? people.find((p) => p.id === addingRelationToId)
    : undefined;
  const isRootMode = addingRelationType === "root";

  if (!addingRelationType) return null;

  const handleChange = (
    key: keyof PersonFormData,
    val: string | number | undefined,
  ) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.firstName.trim() || !form.lastName.trim()) {
      addNotification(
        "warn",
        "Мэдээлэл дутуу",
        "Гишүүний Овог болон Нэрийг заавал бөглөнө үү.",
      );
      return;
    }

    if (addingRelationType === "spouse" && anchorPerson?.spouseId) {
      addNotification(
        "warn",
        "Зөрчил үүслээ",
        "Сонгосон гишүүн хэдийн бүртгэгдсэн ханьтай байна.",
      );
      return;
    }

    if (!familyTreeId) {
      addNotification("warn", "Алдаа", "Ургийн модны ID олдсонгүй.");
      return;
    }

    let role: Person["relationshipLabel"] = "DESCENDANT";
    if (addingRelationType === "root") {
      role = "HEAD OF CLAN";
    } else if (
      addingRelationType === "father" ||
      addingRelationType === "mother"
    ) {
      role = "DIRECT LINE";
    } else if (addingRelationType === "spouse") {
      role = "SPOUSE";
    }

    let resolvedFatherId: string | undefined;
    let resolvedMotherId: string | undefined;
    let resolvedSpouseId: string | undefined;

    if (addingRelationType === "father") {
      resolvedFatherId = undefined;
      resolvedMotherId = undefined;
      resolvedSpouseId = anchorPerson?.motherId;
    } else if (addingRelationType === "mother") {
      resolvedFatherId = undefined;
      resolvedMotherId = undefined;
      resolvedSpouseId = anchorPerson?.fatherId;
    } else if (addingRelationType === "spouse") {
      resolvedFatherId = undefined;
      resolvedMotherId = undefined;
      resolvedSpouseId = addingRelationToId ?? undefined;
    } else if (addingRelationType === "sibling") {
      resolvedFatherId = anchorPerson?.fatherId;
      resolvedMotherId = anchorPerson?.motherId;
      resolvedSpouseId = undefined;
    } else if (addingRelationType === "child" && anchorPerson) {
      if (anchorPerson.gender === "male") {
        resolvedFatherId = anchorPerson.id;
        resolvedMotherId = anchorPerson.spouseId;
      } else {
        resolvedFatherId = anchorPerson.spouseId;
        resolvedMotherId = anchorPerson.id;
      }
      resolvedSpouseId = undefined;
    }

    const newPersonDraft: Omit<
      Person,
      "id" | "verified" | "pendingOralHistory"
    > = {
      firstName: form.firstName,
      lastName: form.lastName,
      surname: form.surname || undefined,
      clanName: form.clanName,
      birthPlace: form.birthPlace,
      residence: form.residence || undefined,
      citizenship: form.citizenship || undefined,
      phone: form.phone || undefined,
      email: form.email || undefined,
      title: form.title || undefined,
      employment: form.employment || undefined,
      birthYear: form.birthYear,
      gender: form.gender,
      biography:
        form.biography ||
        `${form.clanName} овгийн ${form.firstName} нь ${form.birthPlace} нутагт төрсөн.`,
      occupation: form.occupation || undefined,
      education: form.education || undefined,
      notes: form.notes || undefined,
      zodiacSign: form.zodiacSign || undefined,
      deathDate: form.deathDate || undefined,
      customFields: form.customFields || undefined,
      relationshipLabel: role,
      fatherId: resolvedFatherId,
      motherId: resolvedMotherId,
      spouseId: resolvedSpouseId,
    };

    try {
      setSubmitting(true);

      let avatarUrl: string | undefined;

      if (avatarFile) {
        setUploadingAvatar(true);
        try {
          const formData = new FormData();
          formData.append("file", avatarFile);
          formData.append("folder", "avatars");

          const uploadResult = await api.upload<{ url: string; key: string }>(
            "/uploads/file",
            formData,
          );
          avatarUrl = uploadResult.url;
          
        } catch (uploadErr) {
          console.error("[UPLOAD] Avatar upload failed:", uploadErr);
          addNotification(
            "warn",
            "Зураг оруулах алдаа",
            "Зургийг байршуулж чадсангүй, үргэлжлүүлж байна.",
          );
        } finally {
          setUploadingAvatar(false);
        }
      }

      await addPersonAsync(familyTreeId, { ...newPersonDraft, avatarUrl });

      addNotification(
        "success",
        "Шинэ гишүүн нэмэгдлээ",
        `${form.firstName} ${form.lastName} амжилттай нэмэгдлээ.`,
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Гишүүн нэмэхэд алдаа гарлаа";
      addNotification("warn", "Алдаа", msg);
      return;
    } finally {
      setSubmitting(false);
    }

    setShowSeal(true);
    setForm({ ...initialForm });
    setAvatarFile(null);
    setAvatarPreview(null);

    setTimeout(() => {
      setAddingRelation(null, null);
      setShowSeal(false);
    }, 900);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addNotification("warn", "Алдаа", "Зөвхөн зураг файл оруулна уу.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      addNotification("warn", "Алдаа", "Зураг 2MB-аас хэтрэхгүй байх ёстой.");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const rows = fieldRows(FORM_FIELDS);

  return (
    <div className="fixed inset-0 bg-pine/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#FAF6EE] rounded-3xl border border-bronze/30 shadow-2xl relative overflow-hidden flex flex-col justify-between max-h-[90vh]">
        <div className="bg-pine text-vellum px-6 py-4 flex items-center justify-between border-b-[4px] border-bronze">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-bronze" />
            <span className="font-display font-bold text-base uppercase tracking-wider">
              {isRootMode ? "Гишүүн нэмэх" : "Add New Person"}
            </span>
          </div>
          <button
            onClick={() => setAddingRelation(null, null)}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isRootMode ? (
          <div className="bg-bronze/10 px-6 py-3 border-b border-bronze/20 text-xs font-semibold text-ink text-center"></div>
        ) : (
          <div className="bg-bronze/10 px-6 py-3 border-b border-bronze/20 text-xs font-semibold text-ink flex justify-between">
            <span>Холбоос тавих гишүүн:</span>
            <span className="text-bronze uppercase font-bold">
              {anchorPerson
                ? `${anchorPerson.firstName} -ийн ${addingRelationType === "father" ? "Эцэг" : addingRelationType === "mother" ? "Эх" : addingRelationType === "spouse" ? "Хань" : addingRelationType === "sibling" ? "Ах/Дүү" : "Хүүхэд"}`
                : "Овгийн Сүлжээ"}
            </span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-4 text-xs font-medium"
        >
          {rows.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 ${row.length === 2 ? "sm:grid-cols-2" : ""} gap-3 sm:gap-4`}
            >
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

          <div className="space-y-2 border-t border-ink/10 pt-4">
            <label className="text-stone-400 font-bold uppercase tracking-wider block text-xs">
              Зураг (заавал биш)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {avatarPreview ? (
              <div className="flex items-center gap-3">
                <Image
                  src={avatarPreview}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-bronze/30"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(null);
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Устгах
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-ink/15 rounded-xl text-xs text-ink/50 hover:border-bronze hover:text-bronze transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Зураг сонгох (max 2MB)
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={() => setAddingRelation(null, null)}
              className="w-full sm:w-1/2 border-2 border-ink/15 text-ink/60 py-3.5 rounded-xl font-bold hover:bg-pine/5 text-center uppercase tracking-wider text-xs"
            >
              Clear All
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-1/2 bg-pine text-white py-3.5 rounded-xl font-bold hover:opacity-95 text-center uppercase tracking-wider text-xs shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRootMode
                ? "Гишүүн нэмэх"
                : submitting
                  ? uploadingAvatar
                    ? "Зураг байршуулж байна..."
                    : "Хадгалж байна..."
                  : "Add Person"}
            </button>
          </div>
        </form>
      </div>

      <SealStamp show={showSeal} onComplete={() => setShowSeal(false)} />
    </div>
  );
}

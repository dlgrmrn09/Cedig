"use client";

import React, { useState } from "react";
import { useAppStore, Person } from "@/lib/store";
import { motion, AnimatePresence } from "motion/react";
import { X, FolderPlus } from "lucide-react";
import SealStamp from "@/src/components/SealStamp";
import PersonForm, {
  INITIAL_FORM_DATA,
  type PersonFormData,
  type AvatarState,
} from "@/src/components/PersonForm";
import { ApiRequestError } from "@/src/lib/api";

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

  const [showSeal, setShowSeal] = useState(false);

  const anchorPerson = addingRelationToId
    ? people.find((p) => p.id === addingRelationToId)
    : undefined;
  const isRootMode = addingRelationType === "root";

  if (!addingRelationType) return null;

  // ── Resolve default gender ─────────────────────────────────────────
  const defaultGender = (() => {
    if (addingRelationType === "father") return "male";
    if (addingRelationType === "mother") return "female";
    const a = people.find((p) => p.id === addingRelationToId);
    if (addingRelationType === "spouse" && a) {
      return a.gender === "male" ? "female" : "male";
    }
    return "male";
  })();

  // ── Relation context line ──────────────────────────────────────────
  const relationLabel = anchorPerson
    ? `${anchorPerson.firstName} -ийн ${
        addingRelationType === "father"
          ? "Эцэг"
          : addingRelationType === "mother"
            ? "Эх"
            : addingRelationType === "spouse"
              ? "Хань"
              : addingRelationType === "sibling"
                ? "Ах/Дүү"
                : "Хүүхэд"
      }`
    : "Овгийн Сүлжээ";

  // ── Handle submit ──────────────────────────────────────────────────
  const handleSubmit = async (
    formData: PersonFormData,
    avatar: AvatarState,
  ) => {
    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      addNotification(
        "warn",
        "Мэдээлэл дутуу",
        "Гишүүний Овог болон Нэрийг заавал бөглөнө үү.",
      );
      throw new Error("validation");
    }

    if (formData.birthYear < 1800 || formData.birthYear > 2100) {
      addNotification(
        "warn",
        "Төрсөн он буруу",
        "Төрсөн он 1800 - 2100 хооронд байх ёстой.",
      );
      throw new Error("validation");
    }

    if (addingRelationType === "spouse" && anchorPerson?.spouseId) {
      addNotification(
        "warn",
        "Зөрчил үүслээ",
        "Сонгосон гишүүн хэдийн бүртгэгдсэн ханьтай байна.",
      );
      throw new Error("validation");
    }

    if (!familyTreeId) {
      addNotification("warn", "Алдаа", "Ургийн модны ID олдсонгүй.");
      throw new Error("validation");
    }

    // ── Resolve role ──────────────────────────────────────────────────
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

    // ── Resolve parent IDs ────────────────────────────────────────────
    let fatherId: string | undefined;
    let motherId: string | undefined;
    let spouseId: string | undefined;

    if (addingRelationType === "father") {
      spouseId = anchorPerson?.motherId;
    } else if (addingRelationType === "mother") {
      spouseId = anchorPerson?.fatherId;
    } else if (addingRelationType === "spouse") {
      spouseId = addingRelationToId ?? undefined;
    } else if (addingRelationType === "sibling") {
      fatherId = anchorPerson?.fatherId;
      motherId = anchorPerson?.motherId;
    } else if (addingRelationType === "child" && anchorPerson) {
      if (anchorPerson.gender === "male") {
        fatherId = anchorPerson.id;
        motherId = anchorPerson.spouseId;
      } else {
        fatherId = anchorPerson.spouseId;
        motherId = anchorPerson.id;
      }
    }

    // ── Resolve avatar URL ────────────────────────────────────────────
    let avatarUrl: string | undefined;
    const avatarUrlFromForm = (formData as unknown as Record<string, unknown>)
      .avatarUrl as string | null | undefined;
    if (avatarUrlFromForm) {
      avatarUrl = avatarUrlFromForm;
    } else if (avatar.action === "remove") {
      avatarUrl = undefined;
    }

    // ── Build person draft ────────────────────────────────────────────
    const draft: Omit<Person, "id" | "verified" | "pendingOralHistory"> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      surname: formData.surname || undefined,
      clanName: formData.clanName,
      birthPlace: formData.birthPlace,
      residence: formData.residence || undefined,
      citizenship: formData.citizenship || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      title: formData.title || undefined,
      employment: formData.employment || undefined,
      birthYear: formData.birthYear,
      gender: formData.gender,
      biography:
        formData.biography ||
        `${formData.clanName} овгийн ${formData.firstName} нь ${formData.birthPlace} нутагт төрсөн.`,
      occupation: formData.occupation || undefined,
      education: formData.education || undefined,
      notes: formData.notes || undefined,
      zodiacSign: formData.zodiacSign || undefined,
      deathDate: formData.deathDate || undefined,
      customFields: formData.customFields || undefined,
      relationshipLabel: role,
      fatherId,
      motherId,
      spouseId,
    };

    try {
      await addPersonAsync(familyTreeId, { ...draft, avatarUrl });

      addNotification(
        "success",
        "Шинэ гишүүн нэмэгдлээ",
        `${formData.firstName} ${formData.lastName} амжилттай нэмэгдлээ.`,
      );

      // Show seal animation then close
      setShowSeal(true);
      setTimeout(() => {
        setAddingRelation(null, null);
        setShowSeal(false);
      }, 900);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.errors?.length) {
          const msgs = err.errors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ");
          addNotification("warn", "Баталгаажуулалт амжилтгүй", msgs);
        } else {
          addNotification("warn", "Алдаа", err.message);
        }
      } else {
        const msg =
          err instanceof Error ? err.message : "Гишүүн нэмэхэд алдаа гарлаа";
        addNotification("warn", "Алдаа", msg);
      }
      throw err;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col scroll-bar-thin scrollbar-thumb-rounded scrollbar-thumb-stone-300"
        >
          {/* ── Top bar ────────────────────────────────────────── */}
          <div className="shrink-0 flex items-center justify-between px-6 py-3.5 bg-pine text-white">
            <div className="flex items-center gap-2.5">
              <FolderPlus className="w-5 h-5 text-bronze/80" />
              <span className="font-semibold text-sm">
                {isRootMode ? "Гишүүн нэмэх" : "Шинэ гишүүн нэмэх"}
              </span>
            </div>
            <button
              onClick={() => setAddingRelation(null, null)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Relation context ────────────────────────────────── */}
          {!isRootMode && (
            <div className="shrink-0 px-6 py-2.5 bg-bronze/5 border-b border-bronze/10 text-xs text-stone-600 flex items-center justify-between">
              <span className="font-medium">Холбоос тавих гишүүн:</span>
              <span className="text-bronze font-bold uppercase text-xs tracking-wide">
                {relationLabel}
              </span>
            </div>
          )}

          {/* ── PersonForm ──────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">
            <PersonForm
              mode="add"
              initialData={{ ...INITIAL_FORM_DATA, gender: defaultGender }}
              onCancel={() => setAddingRelation(null, null)}
              onSubmit={handleSubmit}
              saveLabel="Гишүүн нэмэх"
            />
          </div>
        </motion.div>

        <SealStamp show={showSeal} onComplete={() => setShowSeal(false)} />
      </motion.div>
    </AnimatePresence>
  );
}

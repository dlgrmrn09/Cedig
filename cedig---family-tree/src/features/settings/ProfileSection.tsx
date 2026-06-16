"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import {
  User,
  Save,
  Loader2,
  CheckCircle2,
  CircleAlert,
  Camera,
  Trash2,
} from "lucide-react";
import { profileSchema, type ProfileFormData } from "./validation";
import Avatar from "@/src/components/shared/Avatar";
import AvatarCropModal from "./AvatarCropModal";

interface ProfileSectionProps {
  initialFirstName: string;
  initialLastName: string;
  initialUsername: string;
  avatarUrl: string | null;
  onSave: (data: ProfileFormData) => Promise<void>;
  onAvatarUpload: (file: Blob) => Promise<void>;
  onAvatarDelete: () => Promise<void>;
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

export default function ProfileSection({
  initialFirstName,
  initialLastName,
  initialUsername,
  avatarUrl,
  onSave,
  onAvatarUpload,
  onAvatarDelete,
}: ProfileSectionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarDeleting, setAvatarDeleting] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      username: initialUsername,
    },
  });

  const values = watch();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const hasChanges =
    values.firstName !== initialFirstName ||
    values.lastName !== initialLastName ||
    values.username !== initialUsername;

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      await onSave(data);
      setSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setAvatarError("Зөвхөн JPG, PNG, WebP форматтай зураг оруулна уу.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError("Зураг 5MB-аас хэтрэхгүй байх ёстой.");
      return;
    }

    setCropFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCrop = async (blob: Blob) => {
    setAvatarUploading(true);
    setAvatarError(null);
    try {
      await onAvatarUpload(blob);
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : "Зураг оруулахад алдаа гарлаа",
      );
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!avatarUrl) return;
    setAvatarDeleting(true);
    setAvatarError(null);
    try {
      await onAvatarDelete();
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : "Зураг устгахад алдаа гарлаа",
      );
    } finally {
      setAvatarDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6"
    >
      <div className="pb-4 border-b border-stone-200/50 flex justify-between items-center">
        <div>
          <h3 className="font-display font-bold text-lg text-ink">
            Хувийн Мэдээлэл
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Өөрийн нэр, овог, хэрэглэгчийн нэрээ шинэчлэх
          </p>
        </div>
        <User className="w-5 h-5 text-bronze/80" />
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-bold"
        >
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>Профайл амжилттай шинэчлэгдлээ.</span>
        </motion.div>
      )}

      {avatarError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-xs font-bold"
        >
          <CircleAlert className="w-4.5 h-4.5 text-red-600 shrink-0" />
          <span>{avatarError}</span>
        </motion.div>
      )}

      {/* Avatar Section */}
      <div className="flex items-center gap-5 p-4 bg-stone-50 rounded-xl border border-stone-100">
        <Avatar
          src={avatarUrl}
          name={`${values.firstName} ${values.lastName}`}
          size={72}
          className="ring-2 ring-white shadow-md"
        />

        <div className="space-y-2">
          <p className="text-xs font-bold text-stone-700">Профайл зураг</p>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Профайл зураг сонгох"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] font-bold text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition cursor-pointer disabled:opacity-50"
            >
              {avatarUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
              {avatarUrl ? "Зураг солих" : "Зураг нэмэх"}
            </button>
            {avatarUrl && (
              <button
                onClick={handleDeleteAvatar}
                disabled={avatarDeleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 rounded-lg text-[11px] font-bold text-red-500 hover:bg-red-50 hover:border-red-300 transition cursor-pointer disabled:opacity-50"
              >
                {avatarDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Устгах
              </button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 tracking-wider uppercase block">
              Нэр
            </label>
            <input
              type="text"
              placeholder="Нэр"
              value={values.firstName}
              {...register("firstName")}
              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <CircleAlert className="w-3 h-3" />
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 tracking-wider uppercase block">
              Овог
            </label>
            <input
              type="text"
              placeholder="Овог"
              value={values.lastName}
              {...register("lastName")}
              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <CircleAlert className="w-3 h-3" />
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink/60 tracking-wider uppercase block">
            Хэрэглэгчийн нэр
          </label>
          <input
            type="text"
            placeholder="Хэрэглэгчийн нэр"
            value={values.username}
            {...register("username")}
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-all"
          />
          {errors.username && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <CircleAlert className="w-3 h-3" />
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!hasChanges || isSaving}
            className="inline-flex items-center gap-2 bg-pine text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-pine/10 hover:bg-pine/90 active:bg-pine/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Хадгалах
          </button>
        </div>
      </form>

      <AvatarCropModal
        open={!!cropFile}
        file={cropFile}
        onClose={() => setCropFile(null)}
        onCrop={handleCrop}
      />
    </motion.div>
  );
}

"use client";

import { useRef, type DragEvent } from "react";
import Image from "next/image";
import { Upload, Trash2, Loader2, User, ImagePlus } from "lucide-react";

export interface AvatarUploadProps {
  currentUrl?: string | null;
  previewUrl: string | null;
  isUploading: boolean;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  onCancelRemove?: () => void;
  isRemoved?: boolean;
  size?: number;
  disabled?: boolean;
}

export default function AvatarUpload({
  currentUrl,
  previewUrl,
  isUploading,
  onFileSelect,
  onRemove,
  onCancelRemove,
  isRemoved = false,
  size = 80,
  disabled = false,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const displayUrl = isRemoved ? null : previewUrl || currentUrl || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return;
    onFileSelect(file);
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return;
    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute opacity-0 w-0 h-0 overflow-hidden"
        aria-label="Select avatar image"
      />

      <div
        className="relative group cursor-pointer"
        style={{ width: size, height: size }}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        role="button"
        tabIndex={0}
        aria-label={
          displayUrl
            ? "Click to change avatar, or drag and drop a new image"
            : "Click to add avatar, or drag and drop an image"
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        {/* Avatar image or fallback */}
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt="Avatar preview"
            width={size}
            height={size}
            className="w-full h-full rounded-full object-cover ring-2 ring-bronze/20"
            style={{ width: size, height: size }}
          />
        ) : (
          <div
            className="w-full h-full rounded-full bg-stone-100 ring-2 ring-stone-200 flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <User
              className="text-stone-300"
              style={{ width: size * 0.45, height: size * 0.45 }}
            />
          </div>
        )}

        {/* Uploading overlay */}
        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Loader2 className="text-white animate-spin" style={{ width: size * 0.3, height: size * 0.3 }} />
          </div>
        )}

        {/* Hover overlay */}
        {!isUploading && !disabled && (
          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors duration-200">
            <ImagePlus className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ width: size * 0.3, height: size * 0.3 }} />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-medium text-stone-600 hover:border-bronze hover:text-bronze transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Upload className="w-3 h-3" />
          {currentUrl ? "Солих" : "Нэмэх"}
        </button>

        {currentUrl && !isRemoved && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            disabled={disabled || isUploading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-medium text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3 h-3" />
            Устгах
          </button>
        )}

        {isRemoved && onCancelRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancelRemove();
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-medium text-bronze hover:bg-bronze/5 transition-colors"
          >
            Цуцлах
          </button>
        )}
      </div>
    </div>
  );
}

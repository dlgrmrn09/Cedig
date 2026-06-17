import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { motion } from "motion/react";
import { X, Upload, Image as ImageIcon, FileText, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/cn";
import Image from "next/image";

export type UploadTargetType = "photo" | "document";

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  type: UploadTargetType;
  onUpload: (data: {
    title: string;
    description: string;
    url: string;
    file: File;
  }) => void;
}

export function UploadDialog({
  open,
  onClose,
  type,
  onUpload,
}: UploadDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setSelectedFileUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!title || !selectedFile) return;
    setUploading(true);
    try {
      console.log("[UPLOAD] Submitting upload", {
        title,
        description,
        fileName: selectedFile.name,
      });
      await onUpload({ title, description, url: "", file: selectedFile });
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setSelectedFileUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const isPhoto = type === "photo";

  return (
    <div
      className="fixed inset-0 z-[140] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#FAF6EE] max-w-md w-full rounded-3xl border-4 border-[#32231A] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#32231A]/20">
          <div>
            <h2 className="font-display font-bold text-base text-ink">
              {isPhoto ? "New historical photo" : "New historical document"}
            </h2>
            <p className="text-[10px] text-ink/50 mt-0.5">
              {isPhoto
                ? "Add a photograph to the archival record"
                : "Upload a document (PDF, image)"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer",
              isDragging
                ? "border-bronze bg-bronze/10"
                : selectedFileUrl
                  ? "border-bronze/50"
                  : "border-ink/20 hover:border-bronze/50",
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={isPhoto ? "image/*" : "image/*,application/pdf"}
              onChange={handleFileSelect}
              className="hidden"
            />
            {selectedFileUrl && isPhoto ? (
              <div className="relative h-24 mx-auto max-w-[120px] rounded-lg overflow-hidden">
                <Image
                  src={selectedFileUrl}
                  alt="Preview"
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-bronze/15 flex items-center justify-center mb-2">
                  {isPhoto ? (
                    <ImageIcon className="w-6 h-6 text-bronze" />
                  ) : (
                    <FileText className="w-6 h-6 text-bronze" />
                  )}
                </div>
                <Upload className="w-5 h-5 text-ink/30 mb-1" />
                <p className="text-xs font-bold text-ink/50">
                  {isPhoto ? "Drop a photo here" : "Drop a document here"}
                </p>
                <p className="text-[10px] text-ink/30 mt-0.5">
                  or click to browse
                </p>
              </div>
            )}
          </div>

          {selectedFile && (
            <p className="text-[10px] text-ink/50 truncate">
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isPhoto ? "Photo title..." : "Document title..."}
              className="w-full bg-white border border-ink/15 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-bronze placeholder-ink/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
              {isPhoto ? "Description / Year" : "Description"}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isPhoto
                  ? "e.g., Summer of 1964, Ulaanbaatar..."
                  : "Brief description..."
              }
              className="w-full bg-white border border-ink/15 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-bronze placeholder-ink/30"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-stone-200 text-ink text-xs font-bold hover:bg-stone-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title || !selectedFile || uploading}
              className="flex-1 py-2.5 rounded-xl bg-[#3B291D] text-white text-xs font-bold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

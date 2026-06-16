'use client';

import React, { useState, useCallback, useRef } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { motion } from 'motion/react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Loader2 } from 'lucide-react';

interface AvatarCropModalProps {
  open: boolean;
  file: File | null;
  onClose: () => void;
  onCrop: (croppedBlob: Blob) => Promise<void>;
}

function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('No 2d context')); return; }

      canvas.width = 320;
      canvas.height = 320;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        320,
        320,
      );

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas empty'));
        },
        'image/jpeg',
        0.9,
      );
    };
    image.onerror = () => reject(new Error('Image load failed'));
  });
}

export default function AvatarCropModal({ open, file, onClose, onCrop }: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileUrlRef = useRef<string | null>(null);

  if (file && file !== null) {
    const url = URL.createObjectURL(file);
    if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current);
    fileUrlRef.current = url;
  }

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels || !fileUrlRef.current) return;
    setUploading(true);
    try {
      const croppedBlob = await getCroppedImg(fileUrlRef.current, croppedAreaPixels);
      await onCrop(croppedBlob);
      handleClose();
    } catch {
      // error handled by parent
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (fileUrlRef.current) {
      URL.revokeObjectURL(fileUrlRef.current);
      fileUrlRef.current = null;
    }
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    onClose();
  };

  if (!open || !file || !fileUrlRef.current) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="font-bold text-stone-800 text-sm">Зураг тайрах</h3>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full h-72 bg-stone-900">
          <Cropper
            image={fileUrlRef.current}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-4">
            <ZoomOut className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-pine"
              aria-label="Zoom"
            />
            <ZoomIn className="w-4 h-4 text-stone-400 shrink-0" />
          </div>

          <div className="flex items-center gap-4">
            <RotateCw className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1 accent-pine"
              aria-label="Rotate"
            />
            <span className="text-[10px] text-stone-400 w-7 text-right shrink-0">{rotation}&deg;</span>
          </div>

          <button
            onClick={handleSave}
            disabled={uploading || !croppedAreaPixels}
            className="w-full bg-pine text-white py-2.5 rounded-xl font-bold text-sm hover:bg-pine/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Хадгалж байна...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Хадгалах
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

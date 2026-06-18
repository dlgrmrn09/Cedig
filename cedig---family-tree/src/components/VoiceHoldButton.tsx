"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Mic, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { api, ApiRequestError } from "@/src/lib/api";

interface VoiceHoldButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

type RecorderState = "idle" | "activating" | "recording" | "transcribing";

const CANCEL_THRESHOLD = 80;

export default function VoiceHoldButton({
  onTranscript,
  disabled,
}: VoiceHoldButtonProps) {
  const [state, setState] = useState<RecorderState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [cancelMode, setCancelMode] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const stopRequestedRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const cancelModeRef = useRef(false);

  const updateCancelMode = useCallback((value: boolean) => {
    cancelModeRef.current = value;
    setCancelMode(value);
  }, []);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
  }, []);

  const transcribeAudio = useCallback(
    async (audioBlob: Blob) => {
      try {
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        const result = await api.upload<{ text: string }>(
          "/speech-to-text",
          formData
        );

        if (result.text?.trim()) {
          onTranscript(result.text.trim());
        }
        setError(null);
        setState("idle");
      } catch (err) {
        const message =
          err instanceof ApiRequestError
            ? err.message
            : "Сүлжээний алдаа гарлаа.";
        setError(message);
        setState("idle");
      }
    },
    [onTranscript]
  );

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setState("activating");
      stopRequestedRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (stopRequestedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        setState("idle");
        return;
      }

      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        cleanup();
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        if (blob.size > 0 && !stopRequestedRef.current) {
          await transcribeAudio(blob);
        } else {
          setState("idle");
        }
      };

      mediaRecorder.onerror = () => {
        cleanup();
        setError("Бичлэгийн алдаа гарлаа.");
        setState("idle");
      };

      mediaRecorder.start();
      setState("recording");
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          setError("Микрофонд хандах эрх олгогдоогүй байна.");
        } else if (err.name === "NotFoundError") {
          setError("Микрофон төхөөрөмж олдсонгүй.");
        } else {
          setError("Микрофон эхлүүлэхэд алдаа гарлаа.");
        }
      } else {
        setError("Бичлэг эхлүүлэхэд алдаа гарлаа.");
      }
      cleanup();
      setState("idle");
    }
  }, [transcribeAudio, cleanup]);

  const stopRecording = useCallback(
    (shouldTranscribe: boolean) => {
      const mr = mediaRecorderRef.current;

      if (state === "activating") {
        stopRequestedRef.current = true;
        return;
      }

      if (mr && mr.state === "recording") {
        if (!shouldTranscribe) {
          stopRequestedRef.current = true;
          mr.onstop = () => {
            cleanup();
            chunksRef.current = [];
            setState("idle");
          };
        }
        mr.stop();
        if (shouldTranscribe) {
          setState("transcribing");
        }
      }
    },
    [state, cleanup]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (disabled || state !== "idle") return;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      updateCancelMode(false);
      startRecording();
    },
    [disabled, state, startRecording, updateCancelMode]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (state !== "recording" && state !== "activating") return;

      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;
      const inCancelZone = dx < -CANCEL_THRESHOLD || dy < -CANCEL_THRESHOLD;

      if (inCancelZone !== cancelModeRef.current) {
        updateCancelMode(inCancelZone);
      }
    },
    [state, updateCancelMode]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (state === "recording" || state === "activating") {
        stopRecording(!cancelModeRef.current);
      }
      updateCancelMode(false);
    },
    [state, stopRecording, updateCancelMode]
  );

  const handlePointerLeave = useCallback(() => {
    if (state === "recording" || state === "activating") {
      stopRecording(false);
    }
    updateCancelMode(false);
  }, [state, stopRecording, updateCancelMode]);

  const handlePointerCancel = useCallback(() => {
    stopRecording(false);
    updateCancelMode(false);
  }, [stopRecording, updateCancelMode]);

  useEffect(() => {
    if (state === "recording") {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          stopRecording(false);
          updateCancelMode(false);
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [state, stopRecording, updateCancelMode]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const isActive = state === "activating" || state === "recording";
  const isLoading = state === "transcribing";

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerCancel}
        onContextMenu={(e) => e.preventDefault()}
        disabled={disabled || isLoading}
        aria-label={
          cancelMode
            ? "Хүчингүй болгох"
            : isActive
              ? "Бичлэгээ гаргах — илгээх"
              : "Дуу хоолойгоор оруулах (дарж барина уу)"
        }
        className={`relative flex items-center justify-center w-8 h-8 rounded-full
          select-none touch-none
          transition-all duration-200 focus:outline-none focus-visible:ring-2
          focus-visible:ring-bronze focus-visible:ring-offset-1 cursor-pointer
          ${
            cancelMode
              ? "bg-red-500 text-white shadow-lg shadow-red-500/50 scale-110"
              : isActive
                ? "bg-cinnabar text-white shadow-lg shadow-cinnabar/40 scale-110"
                : isLoading
                  ? "bg-stone-200 text-stone-400"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700"
          }`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : cancelMode ? (
          <>
            <Trash2 className="w-4 h-4 animate-shake" />
            <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75" />
          </>
        ) : isActive ? (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <span className="absolute inset-0 rounded-full border-2 border-cinnabar/60 animate-ping opacity-75" />
          </>
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {state === "activating" && (
        <span className="text-[10px] text-stone-400 font-medium whitespace-nowrap select-none animate-pulse">
          Холбогдож байна...
        </span>
      )}

      {state === "recording" && !cancelMode && (
        <span className="text-[10px] text-cinnabar font-semibold animate-pulse whitespace-nowrap select-none">
          Бичиж байна... Цуцлах ←
        </span>
      )}

      {cancelMode && (
        <span className="text-[10px] text-red-500 font-bold whitespace-nowrap select-none animate-slide-in-left">
          Хүчингүй болгох
        </span>
      )}

      {isLoading && (
        <span className="text-[10px] text-stone-400 font-medium whitespace-nowrap select-none">
          Боловсруулж байна...
        </span>
      )}

      {error && state === "idle" && (
        <span className="inline-flex items-center gap-1 text-[10px] text-red-500 max-w-[160px]">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span className="line-clamp-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 ml-0.5 shrink-0"
            aria-label="Алдааг арилгах"
          >
            ×
          </button>
        </span>
      )}
    </div>
  );
}

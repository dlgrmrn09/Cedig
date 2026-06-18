"use client";

import React, { useState, useRef, useCallback } from "react";
import { Mic, MicOff, Loader2, AlertCircle } from "lucide-react";
import { api, ApiRequestError } from "@/src/lib/api";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

type RecorderState = "idle" | "recording" | "transcribing";

export default function VoiceRecorder({ onTranscript, disabled }: VoiceRecorderProps) {
  const [state, setState] = useState<RecorderState>("idle");
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        await transcribeAudio(blob);
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

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setState("transcribing");
    }
  }, []);

  const handleClick = () => {
    if (state === "recording") {
      stopRecording();
    } else if (state === "idle") {
      startRecording();
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || state === "transcribing"}
        aria-label={
          state === "recording" ? "Бичлэгийг зогсоох" : "Дуу хоолойгоор оруулах"
        }
        className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 focus:outline-none ${
          state === "recording"
            ? "bg-red-500 text-white shadow-lg shadow-red-500/40 scale-110"
            : state === "transcribing"
              ? "bg-stone-200 text-stone-400 cursor-wait"
              : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700"
        }`}
      >
        {state === "transcribing" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : state === "recording" ? (
          <>
            <MicOff className="w-3.5 h-3.5" />
            <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75" />
          </>
        ) : (
          <Mic className="w-3.5 h-3.5" />
        )}
      </button>

      {state === "recording" && (
        <span className="text-[10px] text-red-500 font-semibold animate-pulse whitespace-nowrap">
          Бичиж байна...
        </span>
      )}

      {state === "transcribing" && (
        <span className="text-[10px] text-stone-400 font-medium whitespace-nowrap">
          Боловсруулж байна...
        </span>
      )}

      {error && state === "idle" && (
        <span className="inline-flex items-center gap-1 text-[10px] text-red-500">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span className="line-clamp-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 ml-0.5"
          >
            ×
          </button>
        </span>
      )}
    </div>
  );
}

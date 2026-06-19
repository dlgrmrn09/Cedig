"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAppStore } from "@/src/store";
import { useRecaptcha } from "@/src/hooks/useRecaptcha";
import {
  PlusCircle,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TreePine,
} from "lucide-react";

export default function OnboardingPlaceholder({ hasAnyTree }: { hasAnyTree: boolean }) {
  const router = useRouter();
  const {
    joinTreeAsync,
    joinTreeAsyncWithCaptcha,
    createTreeAsync,
    trees,
  } = useAppStore();
  const { executeRecaptcha, isConfigured } = useRecaptcha();

  const ownedTreeCount = trees.filter((t) => t.role === 'Owner').length;
  const hasTree = ownedTreeCount > 0;
  const [mode, setMode] = useState<"select" | "create" | "join">("select");
  const [treeName, setTreeName] = useState("");
  const [treeDescription, setTreeDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!treeName.trim()) {
      setErrorMsg("Ургийн модны нэрийг оруулна уу.");
      return;
    }

    if (hasTree) {
      setErrorMsg("Та аль хэдийн ургийн мод үүсгэсэн байна.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await createTreeAsync(treeName);
      setSuccessMsg("Ургийн мод амжилттай үүсгэгдлээ!");
      setTimeout(() => {
        router.push("/family-tree");
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Үүсгэхэд алдаа гарлаа.";
      if (msg.includes("already owns") || msg.includes("409")) {
        setErrorMsg(
          "Та аль хэдийн нэг ургийн мод үүсгэсэн байна. Хэрэглэгч бүр зөвхөн нэг мод үүсгэх боломжтой.",
        );
      } else {
        setErrorMsg("Үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.length < 5) {
      setErrorMsg("Зөв урилгын код оруулна уу (жишээ нь: SARTUUL-785)");
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isConfigured) {
        const token = await executeRecaptcha("join_tree");
        await joinTreeAsyncWithCaptcha(joinCode.toUpperCase(), token);
      } else {
        await joinTreeAsync(joinCode.toUpperCase());
      }
      setSuccessMsg("Хүсэлт илгээгдлээ. Ургийн модны эзэмшигч таны хүсэлтийг баталгаажуулсны дараа та нэвтрэх боломжтой.");
      setTimeout(() => {
        router.push("/family-tree");
      }, 2000);
    } catch {
      setErrorMsg(
        "Урилгын код олдсонгүй эсвэл хүчингүй байна. Дахин шалгана уу.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setMode("select");
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  if (hasTree) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Onboarding Banner */}
      {mode === "select" && (
        <>
          {/* Banner Card */}
          <div className="bg-gradient-to-br from-bronze/10 via-bronze/5 to-vellum border border-bronze/30 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-bronze/20 flex items-center justify-center shrink-0">
                <TreePine className="w-7 h-7 text-bronze" />
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-display font-bold text-ink mb-1.5">
                  {hasAnyTree
                    ? "Та ургийн модоо үүсгээгүй байна"
                    : "Ургийн бичгийн эхлэл"}
                </h2>
                <p className="text-sm text-ink/60 leading-relaxed">
                  {hasAnyTree
                    ? "Та өөр ургийн модны гишүүн боловч өөрийн модоо үүсгээгүй байна. Өөрийн гэр бүлийн түүхийг эхлүүлээрэй."
                    : "Гэр бүлийнхаа дижитал санг үүсгэж, эх сурвалж, зураг, түүх уламжлалаа аюулгүй хадгалах."}
                </p>
              </div>
            </div>
          </div>

          {/* Error / Success */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-150 text-red-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-150 text-emerald-700 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Action Cards */}
          <div className="grid sm:grid-cols-2 gap-5">
            <button
              onClick={() => setMode("create")}
              className="p-6 rounded-2xl border-2 border-ink/10 hover:border-bronze hover:bg-vellum/30 text-left transition-all flex flex-col justify-between group bg-white min-h-[200px]"
            >
              <div className="w-11 h-11 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink mb-1.5 group-hover:text-bronze transition-colors">
                  Шинээр ургийн мод үүсгэх
                </h3>
                <p className="text-xs text-ink/60 leading-relaxed">
                  Гэр бүлийнхаа дижитал санг үүсгэж, эх сурвалж, зураг, түүх
                  уламжлалаа аюулгүй хадгалах.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-bronze pt-3">
                Эхлэх <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => setMode("join")}
              className="p-6 rounded-2xl border-2 border-ink/10 hover:border-bronze hover:bg-vellum/30 text-left transition-all flex flex-col justify-between group bg-white min-h-[200px]"
            >
              <div className="w-11 h-11 rounded-xl bg-pine/5 flex items-center justify-center text-ink group-hover:scale-105 transition-transform">
                <Users className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink mb-1.5 group-hover:text-bronze transition-colors">
                  Ургийн модны код оруулах
                </h3>
                <p className="text-xs text-ink/60 leading-relaxed">
                  Гэр бүлийн гишүүний илгээсэн урилгын кодыг ашиглан нэгдэж,
                  хамтдаа ажиллах.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-bronze pt-3">
                Кодоор нэгдэх <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </>
      )}

      {/* CREATE FORM */}
      {mode === "create" && !hasTree && (
        <form onSubmit={handleCreate} className="bg-white border border-bronze/20 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 max-w-xl mx-auto">
          <div className="space-y-1">
            <button
              type="button"
              onClick={handleBack}
              className="text-xs text-bronze font-semibold hover:underline"
            >
              ← Буцах
            </button>
            <h2 className="text-xl font-display font-bold text-ink">
              Шинэ ургийн мод үүсгэх
            </h2>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-150 text-red-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold tracking-wider uppercase text-ink/60">
              Ургийн Овог
            </label>
            <input
              type="text"
              required
              placeholder="Name"
              value={treeName}
              onChange={(e) => setTreeName(e.target.value)}
              className="w-full bg-stone-50 border-2 border-ink/10 rounded-xl px-4 py-3 placeholder-stone-400 focus:outline-none focus:border-bronze transition-all text-base"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold tracking-wider uppercase text-ink/60">
              Товч тайлбар
            </label>
            <textarea
              placeholder="Description (optional) "
              value={treeDescription}
              onChange={(e) => setTreeDescription(e.target.value)}
              className="w-full h-24 bg-stone-50 border-2 border-ink/10 rounded-xl p-4 placeholder-stone-400 focus:outline-none focus:border-bronze transition-all text-base resize-none"
            />
          </div>

          <p className="text-xs text-ink/50 italic">
            All family trees are private by default.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pine text-white py-4 rounded-xl font-bold hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            {loading ? "Үүсгэж байна..." : "Ургийн мод үүсгэх"}{" "}
            <ArrowRight className="w-5 h-5 text-bronze" />
          </button>
        </form>
      )}

      {/* JOIN FORM */}
      {mode === "join" && (
        <form onSubmit={handleJoin} className="bg-white border border-bronze/20 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 max-w-xl mx-auto">
          <div className="space-y-1">
            <button
              type="button"
              onClick={handleBack}
              className="text-xs text-bronze font-semibold hover:underline"
            >
              ← Буцах
            </button>
            <h2 className="text-xl font-display font-bold text-ink">
              Код оруулах
            </h2>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-150 text-red-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold tracking-wider uppercase text-ink/60">
              Урилгын тусгай код
            </label>
            <input
              type="text"
              required
              placeholder="-   -   -   -   -   -"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full bg-stone-50 border-2 border-ink/10 rounded-xl px-4 py-4 text-center text-lg font-bold placeholder-stone-400 focus:outline-none focus:border-bronze transition-all uppercase tracking-wider"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pine text-white py-4 rounded-xl font-bold hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? "Холбож байна..." : "Урилгыг баталгаажуулж нэгдэх"}{" "}
            <ArrowRight className="w-5 h-5 text-bronze" />
          </button>
        </form>
      )}
    </div>
  );
}

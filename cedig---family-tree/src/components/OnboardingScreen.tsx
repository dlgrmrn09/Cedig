"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useRecaptcha } from "@/src/hooks/useRecaptcha";
import {
  PlusCircle,
  Users,
  ArrowRight,
  Compass,
  CheckCircle2,
  AlertCircle,
  FolderLock,
  TreePine,
} from "lucide-react";

export default function OnboardingScreen() {
  const router = useRouter();
  const {
    joinTree,
    createTreeAsync,
    joinTreeAsync,
    joinTreeAsyncWithCaptcha,
    logout,
    user,
    trees,
  } = useAppStore();
  const { executeRecaptcha, isConfigured } = useRecaptcha();

  const hasTree = trees.filter((t: any) => t.role === "Owner").length > 0;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
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
      }, 1000);
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
      setSuccessMsg(
        "Хүсэлт илгээгдлээ. Ургийн модны эзэмшигч таны хүсэлтийг баталгаажуулсны дараа та нэвтрэх боломжтой.",
      );
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

  return (
    <div className="min-h-screen relative flex flex-col justify-between font-sans-ui text-ink bg-vellum selection:bg-bronze/30">
      <div className="absolute inset-0 ulzii-pattern opacity-30 pointer-events-none" />

      {/* Header with mini metadata status */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between z-10 relative">
        <span className="text-xl font-display font-bold text-ink tracking-tight">
          CEDIG ARCHIVES
        </span>

        <div className="flex items-center gap-4">
          <span className="text-xs text-ink/60 hidden sm:inline-block">
            <b>{user?.email}</b>
          </span>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold hover:text-bronze transition-colors bg-white px-3 py-1.5 rounded-lg border border-ink/10 cursor-pointer "
          >
            Гарах
          </button>
        </div>
      </header>

      {/* Primary Card */}
      <main className="flex-grow flex items-center justify-center p-6 z-10 relative">
        <div className="w-full max-w-2xl bg-white border border-bronze/20 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-150 text-red-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-150 text-emerald-700 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STATE: SELECT DECISION */}
          {mode === "select" && (
            <div className="space-y-8">
              <div className="text-center max-w-md mx-auto">
                <h1 className="text-3xl font-display font-bold text-ink">
                  {hasTree ? "Таны ургийн бичиг" : "Ургийн бичгийн эхлэл"}
                </h1>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4">
                {hasTree ? (
                  <button
                    onClick={() => router.push("/family-tree")}
                    className="p-8 rounded-2xl border-2 border-bronze bg-bronze/5 hover:bg-bronze/10 text-left transition-all flex flex-col justify-between group h-64"
                  >
                    <div className="w-12 h-12 rounded-xl bg-bronze/20 flex items-center justify-center text-bronze group-hover:scale-105 transition-transform">
                      <TreePine className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-bronze transition-colors">
                        Ургийн мод руу очих
                      </h3>
                      <p className="text-xs text-ink/60 leading-relaxed">
                        Та аль хэдийн ургийн мод үүсгэсэн байна. Үргэлжлүүлэн
                        ажиллах.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-bronze pt-2">
                      Нээх <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                ) : (
                  <button
                    id="create-tree-option"
                    onClick={() => setMode("create")}
                    className="p-8 rounded-2xl border-2 border-ink/10 hover:border-bronze hover:bg-vellum/30 text-left transition-all flex flex-col justify-between group h-64"
                  >
                    <div className="w-12 h-12 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze group-hover:scale-105 transition-transform">
                      <PlusCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-bronze transition-colors">
                        Шинээр ургийн мод үүсгэх
                      </h3>
                      <p className="text-xs text-ink/60 leading-relaxed">
                        Гэр бүлийнхаа дижитал санг үүсгэж, эх сурвалж, зураг,
                        түүх уламжлалаа аюулгүй хадгалах.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-bronze pt-2">
                      Эхлэх <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                )}

                {/* Option: Join */}
                <button
                  id="join-tree-option"
                  onClick={() => setMode("join")}
                  className="p-8 rounded-2xl border-2 border-ink/10 hover:border-bronze hover:bg-vellum/30 text-left transition-all flex flex-col justify-between group h-64"
                >
                  <div className="w-12 h-12 rounded-xl bg-pine/5 flex items-center justify-center text-ink group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-bronze transition-colors">
                      Ургийн модны код оруулах
                    </h3>
                    <p className="text-xs text-ink/60 leading-relaxed">
                      Гэр бүлийн гишүүний илгээсэн урилгын кодыг ашиглан нэгдэж,
                      хамтдаа ажиллах.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-bronze pt-2">
                    Кодоор нэгдэх <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>

              {/* Demo Quick Access */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs text-ink/75">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-bronze" />
                  <span>Туршиж үзэхийг хүсвэл жишээ үзэх:</span>
                </div>
                <button
                  onClick={() => {
                    joinTree("DEMO-0000", "Demo Tree");
                    router.push("/family-tree");
                  }}
                  className="bg-pine text-white px-3 py-1.5 rounded-lg hover:bg-opacity-90 font-bold ml-4 shrink-0 transition"
                >
                  Demo
                </button>
              </div>
            </div>
          )}

          {/* STATE: CREATE FORM */}
          {mode === "create" && !hasTree && (
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setMode("select")}
                  className="text-xs text-bronze font-semibold hover:underline"
                >
                  ← Буцах
                </button>
                <h2 className="text-2xl font-display font-bold text-ink">
                  Шинэ ургийн мод үүсгэх
                </h2>
              </div>

              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-ink/60">
                  Нууцлалын тохиргоо
                </label>
                <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                  <span className="flex-grow text-center bg-white py-2 rounded-lg font-bold text-ink shadow-sm flex items-center justify-center gap-1">
                    <FolderLock className="w-3.5 h-3.5 text-bronze" /> Зөвхөн
                    урилгаар
                  </span>
                </div>
              </div>

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

          {/* STATE: JOIN FORM */}
          {mode === "join" && (
            <form onSubmit={handleJoin} className="space-y-6">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setMode("select")}
                  className="text-xs text-bronze font-semibold hover:underline"
                >
                  ← Буцах
                </button>
                <h2 className="text-2xl font-display font-bold text-ink">
                  Код оруулах
                </h2>
              </div>

              <div className="space-y-2">
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
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-bronze/10 text-center text-xs text-ink/50 bg-vellum z-10 relative">
        <p>© 2026 CEDIG Ургийн Шинэчлэл.</p>
      </footer>
    </div>
  );
}

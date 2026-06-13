"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  PlusCircle,
  Users,
  ArrowRight,
  Compass,
  CheckCircle2,
  AlertCircle,
  FolderLock,
} from "lucide-react";

export default function OnboardingScreen() {
  const router = useRouter();
  const { createTree, joinTree, logout, user } = useAppStore();
  const [mode, setMode] = useState<"select" | "create" | "join">("select");
  const [treeName, setTreeName] = useState("");
  const [treeDescription, setTreeDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!treeName.trim()) {
      setErrorMsg("Ургийн модны нэрийг оруулна уу.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setLoading(false);
      createTree(treeName);
      setSuccessMsg("Ургийн мод амжилттай үүсгэгдлээ!");
      setTimeout(() => {
        router.push("/family-tree");
      }, 1000);
    }, 1200);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.length < 5) {
      setErrorMsg("Зөв урилгын код оруулна уу (жишээ нь: SARTUUL-785)");
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setLoading(false);
      if (
        joinCode.toUpperCase() === "SARTUUL-785" ||
        joinCode.toUpperCase() === "VIEW-998" ||
        joinCode.toUpperCase().startsWith("CEDIG")
      ) {
        joinTree(joinCode.toUpperCase(), "Sartuul Ogiin Bichig Tree");
        setSuccessMsg("Урилгын холбоос амжилттай баталгаажлаа!");
        setTimeout(() => {
          router.push("/family-tree");
        }, 800);
      } else {
        setErrorMsg(
          "Урилгын код олдсонгүй эсвэл хүчингүй байна. Дахин шалгана уу.",
        );
      }
    }, 1200);
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
            onClick={logout}
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
                  Ургийн бичгийн эхлэл
                </h1>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4">
                {/* Option: Create */}
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
                      Гэр бүлийнхаа дижитал санг үүсгэж, эх сурвалж, зураг, түүх
                      уламжлалаа аюулгүй хадгалах.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-bronze pt-2">
                    Эхлэх <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

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
                    joinTree("SARTUUL-2026", "Sartuul Ogiin Bichig");
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
          {mode === "create" && (
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
                <p className="text-xs text-ink/60">
                  Бид таны модонд зориулж хамгаалалттай тусгай шифрлэгдсэн код
                  үүсгэх болно.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-ink/60">
                  Ургийн модны нэр
                </label>
                <input
                  type="text"
                  required
                  placeholder="Жишээ: Сартуул овгийн Ургийн Бичиг"
                  value={treeName}
                  onChange={(e) => setTreeName(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-ink/10 rounded-xl px-4 py-3 placeholder-stone-400 focus:outline-none focus:border-bronze transition-all text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-ink/60">
                  Товч тайлбар / Уриа үг
                </label>
                <textarea
                  placeholder="Манай овгийн уриа болон аялалын түүх..."
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
                {loading
                  ? "Үүсгэж байна..."
                  : "Ургийн санг баталгаажуулж эхлэх"}{" "}
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
                  Ургийн модонд урилгаар нэгдэх
                </h2>
                <p className="text-xs text-ink/60">
                  Таны гэр бүлийн гишүүний системээс үүсгэж өгсөн кодыг
                  оруулаарай.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-ink/60">
                  Урилгын тусгай код
                </label>
                <input
                  type="text"
                  required
                  placeholder="Жишээ: SARTUUL-785 эсвэл VIEW-998"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-ink/10 rounded-xl px-4 py-4 text-center text-lg font-bold placeholder-stone-400 focus:outline-none focus:border-bronze transition-all uppercase tracking-wider"
                />
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-ink/70 space-y-1">
                <p className="font-bold text-ink">Туршилтын мэдээлэл:</p>
                <p>
                  • Засах эрхтэй нэгдэх: <b>SARTUUL-785</b>
                </p>
                <p>
                  • Зөвхөн харах эрхтэй нэгдэх: <b>VIEW-998</b>
                </p>
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

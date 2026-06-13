"use client";

import React from "react";
import {
  ShieldAlert,
  Users,
  TrendingUp,
  Database,
  CreditCard,
} from "lucide-react";

export function AdminDashboard() {
  return (
    <div
      id="admin-workspace"
      className="max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-bronze/20 shadow-xl space-y-8 text-xs font-semibold"
    >
      <div>
        <h2 className="text-xl font-display font-bold text-ink flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-bronze" /> Удирдах Хянах Самбар
          (Admin)
        </h2>
        <p className="text-xs text-stone-500">
          Нийт систем дэх хэрэглэгчид, хадгалалт, сабскрайб анализ.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-stone-100 bg-stone-50/50 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-stone-400 block text-[9px] font-bold">
              НИЙТ ХЭРЭГЛЭГЧИД
            </span>
            <Users className="w-4 h-4 text-bronze" />
          </div>
          <p className="text-xl font-bold text-ink">12,410</p>
          <span className="text-[10px] text-emerald-600 font-bold">
            ▲ +14% Энэ сард
          </span>
        </div>

        <div className="p-4 rounded-xl border border-stone-100 bg-stone-50/50 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-stone-400 block text-[9px] font-bold">
              НИЙТ УРГИЙН МОД
            </span>
            <TrendingUp className="w-4 h-4 text-bronze" />
          </div>
          <p className="text-xl font-bold text-ink">5,820</p>
          <span className="text-[10px] text-emerald-600 font-bold">
            ▲ +8% Энэ сард
          </span>
        </div>

        <div className="p-4 rounded-xl border border-stone-100 bg-stone-50/50 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-stone-400 block text-[9px] font-bold">
              ХАДГАЛАЛТ СЕРВЕР
            </span>
            <Database className="w-4 h-4 text-bronze" />
          </div>
          <p className="text-xl font-bold text-ink">1.2 TB / 5 TB</p>
          <span className="text-[10px] text-stone-400 font-bold">
            Нийт 24% ашиглалт
          </span>
        </div>

        <div className="p-4 rounded-xl border border-bronze/20 bg-[#FAF6EE] space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-stone-400 block text-[9px] font-bold">
              НИЙТ ОРЛОГО (MNT)
            </span>
            <CreditCard className="w-4 h-4 text-bronze" />
          </div>
          <p className="text-xl font-bold text-amber-700">34,500K₮</p>
          <span className="text-[10px] text-bronze font-bold">
            ▲ +21% Энэ жил
          </span>
        </div>
      </div>

      <div className="p-5 border border-ink/10 rounded-xl space-y-4">
        <span className="text-xs font-bold text-ink uppercase block">
          Орон зайн багтаамж овгоор (Storage Analytics)
        </span>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span>Сартуул овгийн мод (Sartuul Tree Archive)</span>
              <span>1.2 GB / 10 GB (12%)</span>
            </div>
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="bg-bronze h-full rounded-full"
                style={{ width: "12%" }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span>Боржигин овгийн мод (Borgijin Tree Archive)</span>
              <span>4.5 GB / 10 GB (45%)</span>
            </div>
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="bg-pine h-full rounded-full"
                style={{ width: "45%" }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span>Аюулгүйн гадны баталгаат скан нөөцлөлт</span>
              <span>800 MB / 10 GB (8%)</span>
            </div>
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="bg-pine/40 h-full rounded-full"
                style={{ width: "8%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold text-stone-500 uppercase block">
          Хяналтын системийн сүүлийн тэмдэглэл
        </span>
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            <span className="text-xs text-stone-700">
              Бүх систем хэвийн ажиллаж байна. SSL ба шифрлэлт идэвхтэй.
            </span>
          </div>
          <span className="text-[10px] text-stone-400 font-bold">
            Хяналтын Bot
          </span>
        </div>
      </div>
    </div>
  );
}

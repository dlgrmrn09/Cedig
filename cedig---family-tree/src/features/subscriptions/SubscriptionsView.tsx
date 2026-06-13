"use client";

import React from "react";
import { CreditCard } from "lucide-react";

export function SubscriptionsView() {
  return (
    <div
      id="pricing-workspace"
      className="max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-bronze/20 shadow-xl space-y-8 text-xs font-semibold"
    >
      <div className="flex justify-between items-center border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl font-display font-bold text-ink flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-bronze" /> Paymemt
          </h2>
        </div>

        <span className="px-3 py-1 bg-bronze/20 text-bronze font-bold rounded-full uppercase tracking-widest text-[10px]">
          Гэр бүл багц (Идэвхтэй)
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-bronze/20 bg-[#FAF6EE] text-center space-y-1">
          <span className="text-stone-400 block font-bold text-[10px]">
            ИДЭВХТЭЙ ХУГАЦАА
          </span>
          <span className="text-sm font-bold text-ink">
            2027 оны 06-р сар хүртэл
          </span>
        </div>
        <div className="p-4 rounded-xl border border-stone-100 text-center space-y-1 bg-white">
          <span className="text-stone-400 block font-bold text-[10px]">
            ХЭРЭГЛЭСЭН БАГТААМЖ
          </span>
          <span className="text-sm font-bold text-ink">
            1.2 GB / 10 GB (12%)
          </span>
        </div>
        <div className="p-4 rounded-xl border border-stone-100 text-center space-y-1 bg-white">
          <span className="text-stone-400 block font-bold text-[10px]">
            БҮРТГЭСЭН ГИШҮҮД
          </span>
          <span className="text-sm font-bold text-emerald-600">
            6 / Хязгааргүй
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <span className="text-xs font-bold text-bronze uppercase block">
          Төлбөрийн нэхэмжлэлийн түүх
        </span>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="w-full text-left border border-stone-100 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-stone-50 text-[10px] text-stone-500 font-bold uppercase border-b border-stone-150">
                  <th className="p-3 whitespace-nowrap">Нэхэмжлэх ID</th>
                  <th className="p-3 whitespace-nowrap">Багцын нэр</th>
                  <th className="p-3 whitespace-nowrap">Огноо</th>
                  <th className="p-3 text-right whitespace-nowrap">
                    Төлбөрийн хэмжээ
                  </th>
                  <th className="p-3 text-right whitespace-nowrap">Төлөв</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr>
                  <td className="p-3 font-mono font-bold text-[11px] whitespace-nowrap">
                    INV-2026-089
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    Гэр бүл (Family Plan) - Yearly
                  </td>
                  <td className="p-3 whitespace-nowrap">2026-06-10</td>
                  <td className="p-3 text-right font-bold text-ink whitespace-nowrap">
                    222,000₮
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[8px] uppercase">
                      ТӨЛСӨН
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-[11px] whitespace-nowrap">
                    INV-2026-004
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    Үнэгүй туршилт (Free trial)
                  </td>
                  <td className="p-3 whitespace-nowrap">2026-06-01</td>
                  <td className="p-3 text-right font-bold text-stone-400 whitespace-nowrap">
                    0₮
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-500 rounded font-bold text-[8px] uppercase">
                      ДУУССАН
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

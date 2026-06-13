"use client";

import React from "react";
import Logo from "@/src/components/Logo";

export default function Footer() {
  return (
    <footer className="bg-pine text-vellum pt-20 pb-10 relative overflow-hidden mt-auto border-t-[6px] border-bronze">
      <div className="absolute inset-0 ulzii-pattern opacity-[0.06] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center ">
              <div className="relative w-16 h-16 flex items-center ">
                <Logo size={60} />
                <span className="text-2xl font-display font-bold">CEDIG</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Монгол гэр бүлийн түүх, өв соёлыг хадгалах, өвлүүлэн үлдээх
              хамгийн дэвшилтэт платформа.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-wider text-sm text-bronze">
              Холбоосууд
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <button type="button" className="hover:text-bronze transition-colors bg-transparent border-none p-0 cursor-pointer font-inherit text-inherit text-sm">
                  Бидний тухай
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-bronze transition-colors bg-transparent border-none p-0 cursor-pointer font-inherit text-inherit text-sm">
                  Боломжууд
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-bronze transition-colors bg-transparent border-none p-0 cursor-pointer font-inherit text-inherit text-sm">
                  Үйлчилгээний нөхцөл
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-bronze transition-colors bg-transparent border-none p-0 cursor-pointer font-inherit text-inherit text-sm">
                  Нууцлалын бодлого
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-wider text-sm text-bronze">
              Тусламж
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <button type="button" className="hover:text-bronze transition-colors bg-transparent border-none p-0 cursor-pointer font-inherit text-inherit text-sm">
                  Хэрхэн ашиглах вэ?
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-bronze transition-colors bg-transparent border-none p-0 cursor-pointer font-inherit text-inherit text-sm">
                  Түгээмэл асуултууд
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-bronze transition-colors bg-transparent border-none p-0 cursor-pointer font-inherit text-inherit text-sm">
                  Холбоо барих
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-bronze transition-colors bg-transparent border-none p-0 cursor-pointer font-inherit text-inherit text-sm">
                  Блог
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-sm text-bronze">
              CEDIG
            </h4>
            <p className="text-gray-400 text-sm">
              Монгол улсын өв түүхийг мөнхлөх талбар.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-gray-500 text-xs font-semibold">
                Монгол (Mongolian)
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs">
            © 2026 CEDIG Платформ. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  );
}

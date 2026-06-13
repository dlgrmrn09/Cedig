"use client";

import React from "react";

export default function BookPreface() {
  return (
    <div className="shastir-page select-none h-full bg-[#FAF6EE] border-r border-[#2C1A10]/10" data-density="soft">
      <div className="w-full h-full flex flex-col justify-between p-6 md:p-8 relative overflow-hidden bg-[#FCFAF2] border-r border-[#EBE7DF]">
        <div className="absolute top-4 left-6 text-[#735c00] text-[9px] font-black tracking-widest uppercase">
          ✦ ТЭМДЭГЛЭЛ 
        </div>

        <div className="my-auto space-y-5 text-center px-4 max-w-sm mx-auto">
          <span className="text-crimson text-3xl font-black block text-rose-800 drop-shadow-sm leading-none">卍</span>
          <span className="text-[10px] font-bold text-[#735c00] uppercase block tracking-wider font-mono">Угийн ариун шастир</span>
          <p className="text-[#2C1A10] font-serif text-[13px] italic leading-relaxed text-center font-medium">
            &ldquo;Алимад хүмүүн ухаант угийн хотол урсгалыг мэдэж, өвөг
            дээдсийн үйлсийг тэгшлэн хурааваас зохино. Хөх толбот эрэлхэг
            Монгол түмэн өөр өөрсдийн гэр угийн судар, улаан хацарт түүхийг
            ариун бичгээр манаж үлдээгтүн.&rdquo;
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#735c00]/30 to-transparent mx-auto mt-4" />
          <div className="text-[#735c00] text-[10px] font-bold tracking-widest font-sans mt-3">Түүхч эрдэмтдийн товчоон</div>
        </div>

        <div className="text-[10.5px] font-black text-stone-400 text-center uppercase tracking-widest border-t border-[#735c00]/10 pt-2 shrink-0">
           Монгол Улс
        </div>
      </div>
    </div>
  );
}

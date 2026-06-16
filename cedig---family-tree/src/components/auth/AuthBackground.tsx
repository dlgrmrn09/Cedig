'use client';

import Image from 'next/image';

export default function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Image
        src="/assets/background/tree-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />
    </div>
  );
}

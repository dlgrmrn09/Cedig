'use client';

import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: number;
  className?: string;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ src, alt, name, size = 40, className = '' }: AvatarProps) {
  const [error, setError] = React.useState(false);

  if (src && !error) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        width={size}
        height={size}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size }}
        onError={() => setError(true)}
      />
    );
  }

  const initials = getInitials(name);
  return (
    <div
      className={`rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.35) }}
      aria-label={alt || name || 'Avatar'}
    >
      {initials === '?' ? <User size={size * 0.5} /> : initials}
    </div>
  );
}

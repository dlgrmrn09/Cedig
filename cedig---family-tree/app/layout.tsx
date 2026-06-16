import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import { AuthRestorer } from '@/src/components/AuthRestorer';
import { SocketProvider } from '@/src/components/SocketProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'CEDIG - Mongolian Family Tree & Archival Records',
  description: 'Монгол Ургийн Мод ба Гэр Бүлийн Түүхийн Платформ - Preserve and explore Mongolian heritage.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-vellum text-ink" suppressHydrationWarning>
        <AuthRestorer />
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}


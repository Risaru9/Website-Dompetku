"use client"; // Wajib ditambahkan agar bisa pakai usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils'; // Pastikan Anda punya utilitas cn, atau hapus dan pakai string biasa

const navigation = [
  { name: 'Beranda', href: '/' },
  { name: 'Tentang', href: '/tentang' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Panduan', href: '/panduan' },
];

export function PublicNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6 max-w-7xl">
        {/* Logo Section */}
        <Link href="/" className="flex gap-2.5 items-center group">
          <div className="bg-gray-900 text-white p-1.5 rounded-lg transition-transform group-hover:scale-105">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">Dompetku</span>
        </Link>

        {/* Navigation Links (Center) */}
        <nav className="hidden md:flex items-center gap-1 bg-white border border-gray-100 p-1 rounded-full shadow-sm">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out
                  ${isActive 
                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons (Right) */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
          >
            <LogIn className="h-4 w-4" />
            Masuk
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg shadow-gray-900/20 active:scale-95"
          >
            <UserPlus className="h-4 w-4" />
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}
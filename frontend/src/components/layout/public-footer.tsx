import Link from 'next/link';
import { Wallet, Heart } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex gap-2 items-center mb-4">
              <Wallet className="h-6 w-6" />
              <span className="font-bold text-xl">Dompetku</span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
              Aplikasi pengelola keuangan pribadi yang simpel dan mudah dipahami. 
              Catat pemasukan dan pengeluaran, pantau keuanganmu dengan visual yang jelas.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Tautan</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/tentang" className="hover:text-black transition-colors">Tentang Kami</Link></li>
              <li><Link href="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
              <li><Link href="/panduan" className="hover:text-black transition-colors">Panduan</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Akun</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/login" className="hover:text-black transition-colors">Masuk</Link></li>
              <li><Link href="/register" className="hover:text-black transition-colors">Daftar Gratis</Link></li>
              <li>{/* Link dummy untuk tampilan */}
                  <span className="text-gray-400 cursor-not-allowed">Dashboard (Demo)</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>© 2026 Dompetku. Hak cipta dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="h-4 w-4 text-red-500 fill-red-500" /> untuk literasi keuangan Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
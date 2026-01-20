"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Download, 
  LogOut,
  Wallet,
  BookOpen,
  Target
} from "lucide-react";

const MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Input Transaksi", href: "/transaksi", icon: PlusCircle },
  { label: "Laporan", href: "/laporan", icon: FileText },
  { label: "Target Tabungan", href: "/target", icon: Target },
  { label: "Download", href: "/download", icon: Download },
  { label: "Panduan", href: "/panduan1", icon: BookOpen }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-50">
      
      {/* LOGO AREA */}
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
          <Wallet size={20} />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Dompetku</h1>
      </div>

      {/* MENU ITEMS */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Menu Utama
        </p>
        
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT BUTTON */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-medium text-sm"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
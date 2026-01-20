"use client";

import { 
  PlusSquare, 
  BarChart3, 
  Download, 
  Lightbulb, 
  BookOpen, 
  CheckCircle2,
  Target,       // Icon Baru
  ShieldAlert   // Icon Baru
} from 'lucide-react';

// Data Panduan (Diupdate dengan Fitur Baru)
const guides = [
  {
    icon: <PlusSquare className="w-6 h-6" />,
    title: "Cara Input Transaksi",
    description: "Catat setiap pemasukan dan pengeluaranmu.",
    theme: "emerald",
    steps: [
      "Buka menu 'Input Transaksi' di sidebar kiri.",
      "Pilih jenis: Pemasukan (Income) atau Pengeluaran (Expense).",
      "Isi nominal uang, kategori, dan beri catatan singkat.",
      "Klik 'Simpan'. Data otomatis terupdate di Dashboard."
    ]
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Membaca Dashboard",
    description: "Pahami kondisi keuanganmu lewat grafik.",
    theme: "blue",
    steps: [
      "Kartu Hijau = Total uang masuk.",
      "Kartu Merah = Total uang keluar.",
      "Kartu Biru = Saldo saat ini (Otomatis berubah merah jika kritis).",
      "Grafik 'Arus Keuangan' membandingkan Pemasukan vs Pengeluaran.",
      "Gunakan filter waktu (7 Hari / 1 Bulan) untuk analisis lebih dalam."
    ]
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Target Tabungan",
    description: "Wujudkan impianmu dengan menabung terarah.",
    theme: "indigo", // Tema Baru
    steps: [
      "Buka menu 'Target Tabungan' di sidebar.",
      "Klik 'Buat Target Baru' dan isi nama (Cth: Beli Laptop) serta nominal.",
      "Klik tombol 'Kelola Saldo' pada kartu target.",
      "Pilih 'Menabung' untuk menambah saldo, atau 'Tarik Saldo' jika butuh dana darurat.",
      "Pantau progress bar hingga mencapai 100%."
    ]
  },
  {
    icon: <ShieldAlert className="w-6 h-6" />,
    title: "Batas Aman Saldo",
    description: "Sistem peringatan dini agar tidak boros.",
    theme: "rose", // Tema Baru
    steps: [
      "Di Dashboard utama, klik tombol 'Atur Batas Aman' (Pojok Kanan Atas).",
      "Masukkan jumlah minimal saldo yang harus ada di dompetmu.",
      "Jika saldomu turun di bawah angka ini, Dashboard akan memunculkan Peringatan Merah.",
      "Fitur ini membantu menjaga cashflow agar tetap positif."
    ]
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: "Download Laporan",
    description: "Simpan data keuanganmu ke Excel.",
    theme: "violet",
    steps: [
      "Masuk ke menu 'Laporan' di sidebar.",
      "Gunakan filter tanggal untuk memilih periode tertentu.",
      "Hapus transaksi yang salah jika diperlukan (Klik icon tong sampah).",
      "Pergi ke menu 'Download' untuk mengunduh rekap lengkap dalam format .xlsx."
    ]
  },
];

const tips = [
  "Rutin mencatat setiap hari agar data akurat.",
  "Set Batas Aman minimal 10% dari pendapatan bulanan.",
  "Gunakan fitur 'Tarik Saldo' di Target Tabungan hanya untuk keadaan darurat.",
  "Cek grafik mingguan untuk evaluasi area mana yang paling boros."
];

// Helper Style (Diupdate dengan warna baru)
const getThemeClasses = (theme: string) => {
  switch (theme) {
    case 'emerald':
      return {
        bg: 'bg-emerald-100',
        text: 'text-emerald-600',
        border: 'group-hover:border-emerald-500',
        badge: 'bg-emerald-100 text-emerald-700',
      };
    case 'blue':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        border: 'group-hover:border-blue-500',
        badge: 'bg-blue-100 text-blue-700',
      };
    case 'indigo': // Warna untuk Target
      return {
        bg: 'bg-indigo-100',
        text: 'text-indigo-600',
        border: 'group-hover:border-indigo-500',
        badge: 'bg-indigo-100 text-indigo-700',
      };
    case 'rose': // Warna untuk Alert
      return {
        bg: 'bg-rose-100',
        text: 'text-rose-600',
        border: 'group-hover:border-rose-500',
        badge: 'bg-rose-100 text-rose-700',
      };
    case 'violet':
      return {
        bg: 'bg-violet-100',
        text: 'text-violet-600',
        border: 'group-hover:border-violet-500',
        badge: 'bg-violet-100 text-violet-700',
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'group-hover:border-gray-500',
        badge: 'bg-gray-100 text-gray-700',
      };
  }
};

export default function DashboardGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 md:py-12 space-y-12">
      
      {/* --- HEADER SECTION --- */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <BookOpen className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Pusat Bantuan</h1>
            <p className="text-slate-300 text-base leading-relaxed max-w-lg">
              Panduan lengkap menggunakan fitur Dompetku. Pelajari cara mencatat, menganalisis, dan mengelola target tabunganmu dengan efektif.
            </p>
          </div>
        </div>
        
        {/* Hiasan Background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
      </div>

      {/* --- TIMELINE GUIDES --- */}
      <div className="relative space-y-10 pl-2 md:pl-0">
        
        {/* Garis Konektor */}
        <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-slate-200 hidden md:block" />

        {guides.map((guide, index) => {
          const theme = getThemeClasses(guide.theme);
          
          return (
            <div key={index} className="group relative flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              
              {/* Icon Marker (Kiri) */}
              <div className="hidden md:flex flex-shrink-0 z-10">
                <div className={`w-[64px] h-[64px] rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center shadow-md border-4 border-white transition-transform duration-300 group-hover:scale-110`}>
                  {guide.icon}
                </div>
              </div>

              {/* Content Card (Kanan) */}
              <div className={`flex-1 bg-white rounded-2xl border border-slate-100 p-6 md:p-7 shadow-sm transition-all duration-300 hover:shadow-lg ${theme.border} hover:-translate-y-1`}>
                
                {/* Header Kartu */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={`md:hidden p-2.5 rounded-lg ${theme.bg} ${theme.text}`}>
                    {guide.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-black transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{guide.description}</p>
                  </div>
                </div>

                {/* Steps List */}
                <div className="space-y-3 bg-slate-50/80 rounded-xl p-5 border border-slate-100">
                  {guide.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full ${theme.badge} flex items-center justify-center text-[10px] font-bold mt-0.5`}>
                        {idx + 1}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- TIPS SECTION --- */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Tips Pro Keuangan</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
              <span className="text-sm text-slate-600 font-medium leading-relaxed">
                {tip}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
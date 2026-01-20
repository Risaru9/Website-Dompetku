import { PublicNavbar } from '@/components/layout/public-navbar';
import { PublicFooter } from '@/components/layout/public-footer';
import { 
  BookOpen, 
  LogIn, 
  PlusSquare, 
  BarChart3, 
  Download, 
  CheckCircle2, 
  Lightbulb,
  Target,       // Icon Target
  ShieldAlert,  // Icon Alert
  KeyRound      // Icon Lupa Password
} from 'lucide-react';

const guides = [
  {
    icon: <BookOpen className="w-6 h-6 text-white" />,
    title: "Cara Mendaftar",
    color: "bg-black",
    steps: [
      "Klik tombol 'Daftar' di pojok kanan atas.",
      "Masukkan nama lengkap, email, dan password.",
      "Klik 'Daftar Sekarang'.",
      "Selesai! Kamu akan diarahkan ke dashboard."
    ]
  },
  {
    icon: <LogIn className="w-6 h-6 text-white" />,
    title: "Cara Masuk",
    color: "bg-slate-700",
    steps: [
      "Klik tombol 'Masuk' di pojok kanan atas.",
      "Masukkan email dan password yang sudah didaftarkan.",
      "Klik 'Masuk'.",
      "Kamu akan masuk ke halaman Dashboard."
    ]
  },
  {
    icon: <KeyRound className="w-6 h-6 text-white" />,
    title: "Lupa Password",
    color: "bg-rose-600",
    steps: [
      "Di halaman Masuk, klik link 'Lupa Password?'.",
      "Masukkan email akunmu yang terdaftar.",
      "Cek kotak masuk emailmu untuk link reset.",
      "Klik link tersebut dan buat password baru yang aman."
    ]
  },
  {
    icon: <PlusSquare className="w-6 h-6 text-white" />,
    title: "Cara Input Transaksi",
    color: "bg-emerald-600",
    steps: [
      "Di dashboard, klik menu 'Input Transaksi' di sidebar.",
      "Pilih jenis transaksi: Pemasukan atau Pengeluaran.",
      "Masukkan nominal uang (contoh: 150000).",
      "Tulis keterangan singkat (contoh: 'Gaji bulan ini').",
      "Tanggal akan otomatis terisi hari ini, tapi bisa diubah.",
      "Klik 'Simpan Transaksi'."
    ]
  },
  {
    icon: <Target className="w-6 h-6 text-white" />,
    title: "Membuat Target Tabungan",
    color: "bg-indigo-600",
    steps: [
      "Klik menu 'Target Tabungan' di sidebar.",
      "Tekan tombol 'Buat Target Baru'.",
      "Isi nama impianmu (misal: 'Beli HP') dan nominal target.",
      "Untuk menabung, klik tombol 'Kelola Saldo' pada kartu target.",
      "Kamu juga bisa menarik saldo tabungan jika ada kebutuhan mendesak."
    ]
  },
  {
    icon: <ShieldAlert className="w-6 h-6 text-white" />,
    title: "Mengatur Batas Aman Saldo",
    color: "bg-orange-600",
    steps: [
      "Di Dashboard utama, klik tombol 'Atur Batas Aman' (kanan atas).",
      "Tentukan jumlah minimal uang yang harus ada di dompetmu.",
      "Sistem akan memberikan peringatan merah jika saldomu menyentuh angka kritis.",
      "Fitur ini membantu menjaga arus kas agar tidak minus."
    ]
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    title: "Cara Membaca Dashboard",
    color: "bg-blue-600",
    steps: [
      "Kartu Hijau menampilkan total pemasukan.",
      "Kartu Merah menampilkan total pengeluaran.",
      "Kartu Biru menampilkan saldo (sisa uang) kamu.",
      "Grafik menampilkan perbandingan pergerakan uang (Pemasukan vs Pengeluaran).",
      "Anda bisa memfilter data 7 hari, 30 hari, atau 1 tahun.",
      "Di bawah grafik ada daftar transaksi terbaru."
    ]
  },
  {
    icon: <Download className="w-6 h-6 text-white" />,
    title: "Cara Download Laporan",
    color: "bg-violet-600",
    steps: [
      "Klik menu 'Laporan' di sidebar.",
      "Pilih rentang tanggal yang ingin didownload.",
      "Klik 'Download Excel'.",
      "File Excel akan terdownload ke komputer/HP kamu.",
      "Buka file dengan Microsoft Excel, Google Sheets, atau aplikasi spreadsheet lainnya."
    ]
  },
];

const tips = [
  "Catat transaksi sesegera mungkin agar tidak lupa.",
  "Manfaatkan fitur 'Target Tabungan' untuk memisahkan dana impian.",
  "Set 'Batas Aman' minimal 10% dari pendapatan bulanan.",
  "Cek dashboard secara rutin (minimal seminggu sekali).",
  "Download laporan bulanan untuk arsip pribadi.",
  "Evaluasi jika pengeluaran hampir melebihi pemasukan.",
  "Konsisten adalah kunci. Tidak perlu detail 100%, yang penting tercatat."
];

export default function GuidePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 bg-gray-50/30">
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-200 text-gray-700 mb-6">
                <BookOpen className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Panduan Penggunaan</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pelajari cara menggunakan Dompetku dalam beberapa menit. 
                Panduan lengkap mulai dari pendaftaran, target tabungan, hingga download laporan.
              </p>
            </div>

            {/* Guide Steps */}
            <div className="space-y-12 relative">
              {/* Vertical Line (Decorative) */}
              <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200 hidden md:block" />

              {guides.map((guide, index) => (
                <div key={index} className="relative flex flex-col md:flex-row gap-8">
                  {/* Icon Marker */}
                  <div className="hidden md:flex flex-shrink-0 z-10">
                    <div className={`w-16 h-16 rounded-2xl ${guide.color} flex items-center justify-center shadow-lg transform transition-transform hover:scale-110`}>
                      {guide.icon}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-white p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                     {/* Mobile Icon (Visible only on mobile) */}
                    <div className={`md:hidden w-12 h-12 rounded-lg ${guide.color} text-white flex items-center justify-center mb-4`}>
                      {guide.icon}
                    </div>

                    <h3 className="text-xl font-bold mb-6 text-gray-800">{guide.title}</h3>
                    <div className="space-y-4">
                      {guide.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 text-sm text-gray-600">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 mt-0.5">
                            {idx + 1}
                          </div>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips Section */}
            <div className="mt-24">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                   <Lightbulb className="w-5 h-5" />
                </div>
                Tips Pencatatan Keuangan
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-white border rounded-xl hover:border-emerald-200 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
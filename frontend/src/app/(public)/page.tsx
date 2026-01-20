import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  PieChart,
  TrendingUp,
  ShieldCheck,
  Zap,
  FileSpreadsheet,
  ClipboardList,
} from 'lucide-react';
import { PublicNavbar } from '@/components/layout/public-navbar';
import { PublicFooter } from '@/components/layout/public-footer';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="relative overflow-hidden bg-white py-20 md:py-32">
          {/* Background blurry blobs decorative elements */}
          <div aria-hidden="true" className="absolute -top-24 -left-20 z-0 h-[300px] w-[300px] rounded-full bg-emerald-100/60 blur-[100px]" />
          <div aria-hidden="true" className="absolute top-1/2 -right-20 z-0 h-[300px] w-[300px] rounded-full bg-blue-100/60 blur-[100px]" />

          <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center md:px-6 max-w-5xl">
            <div className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-600 mb-8 border border-emerald-100">
              <Zap className="mr-2 h-4 w-4" /> 100% Gratis untuk Selamanya
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl lg:leading-[1.1]">
              Kelola Keuangan Pribadimu dengan{' '}
              <span className="text-emerald-600">Simpel</span> dan{' '}
              <span className="text-blue-600">Jelas</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-gray-600">
              Catat pemasukan dan pengeluaran, lihat ringkasan keuangan dengan visual
              yang mudah dipahami, dan download laporan Excel kapan saja.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-black px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 shadow-lg shadow-gray-200/50"
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#features" // Link sementara ke section di bawah
                className="inline-flex items-center justify-center rounded-md border-2 border-gray-200 bg-white px-8 py-3 text-sm font-medium text-gray-900 transition-colors hover:border-black hover:bg-gray-50"
              >
                Lihat Demo
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Tanpa biaya tersembunyi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Tidak perlu koneksi bank</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Data aman & privat</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Semua yang Kamu Butuhkan
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Fitur lengkap untuk mengelola keuangan pribadi tanpa ribet.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border transition-shadow hover:shadow-md">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-900">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Catat Transaksi</h3>
                <p className="text-gray-600 leading-relaxed">
                  Input pemasukan dan pengeluaran dengan mudah dalam hitungan detik.
                </p>
              </div>
               {/* Feature 2 */}
               <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border transition-shadow hover:shadow-md">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-900">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Visualisasi Jelas</h3>
                <p className="text-gray-600 leading-relaxed">
                  Lihat ringkasan keuangan dengan grafik yang mudah dipahami.
                </p>
              </div>
               {/* Feature 3 */}
               <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border transition-shadow hover:shadow-md">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-900">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Pantau Arus Uang</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ketahui kemana uangmu pergi setiap hari, minggu, atau bulan.
                </p>
              </div>
               {/* Feature 4 */}
               <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border transition-shadow hover:shadow-md">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-900">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Export ke Excel</h3>
                <p className="text-gray-600 leading-relaxed">
                  Download laporan keuangan dalam format .xlsx kapan saja.
                </p>
              </div>
               {/* Feature 5 */}
               <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border transition-shadow hover:shadow-md">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-900">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Data Aman</h3>
                <p className="text-gray-600 leading-relaxed">
                  Data tercatat di server dengan aman dan hanya bisa diakses olehmu.
                </p>
              </div>
               {/* Feature 6 */}
               <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border transition-shadow hover:shadow-md">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-900">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Gratis Selamanya</h3>
                <p className="text-gray-600 leading-relaxed">
                  Gunakan semua fitur tanpa biaya, tanpa iklan yang mengganggu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- How it Works Section --- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Mudah Digunakan
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Hanya butuh 3 langkah untuk mulai mengelola keuanganmu.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
              {/* Connector Line (Desktop only) */}
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 z-0" aria-hidden="true"></div>

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-black text-2xl font-bold text-white shadow-lg mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Daftar Gratis</h3>
                <p className="text-gray-600 leading-relaxed max-w-sm">
                  Buat akun dengan email dan password. Tidak perlu kartu kredit.
                </p>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-black text-2xl font-bold text-white shadow-lg mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Catat Transaksi</h3>
                <p className="text-gray-600 leading-relaxed max-w-sm">
                  Input pemasukan dan pengeluaran dengan nominal dan keterangan.
                </p>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-black text-2xl font-bold text-white shadow-lg mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Pantau Dashboard</h3>
                <p className="text-gray-600 leading-relaxed max-w-sm">
                  Lihat ringkasan dan grafik keuanganmu secara real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA Section (Dark) --- */}
        <section className="py-24 bg-[#0F172A]"> {/* Menggunakan warna dark slate custom sesuai desain */}
          <div className="container mx-auto px-4 text-center md:px-6 max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
              Siap Mengelola Keuanganmu?
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              Bergabung sekarang dan mulai mencatat keuangan dengan cara yang lebih cerdas.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-white px-8 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
            >
              Daftar Gratis Sekarang
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
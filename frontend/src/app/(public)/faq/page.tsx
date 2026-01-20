import { PublicNavbar } from '@/components/layout/public-navbar';
import { PublicFooter } from '@/components/layout/public-footer';
import { FaqItem } from '@/components/ui/faq-item';
import { HelpCircle } from 'lucide-react';

// DATA FAQ TERBARU (Update sesuai fitur yang sudah jadi)
const faqs = [
  {
    question: "Apakah Dompetku gratis?",
    answer: "Ya, Dompetku 100% gratis untuk digunakan selamanya. Kami berkomitmen menyediakan alat pencatatan keuangan yang dapat diakses oleh siapa saja tanpa biaya langganan."
  },
  {
    question: "Apakah data saya aman?",
    answer: "Keamanan data adalah prioritas kami. Password Anda dienkripsi (hashed), dan kami menggunakan token JWT untuk sesi yang aman. Data transaksi Anda tersimpan di database yang terisolasi berdasarkan User ID Anda."
  },
  {
    question: "Apa fungsi fitur 'Target Tabungan'?",
    answer: "Fitur ini membantu Anda memisahkan uang untuk tujuan khusus (misal: Beli Laptop). Anda bisa menyetor uang ke dalam target tersebut agar tidak terpakai untuk pengeluaran harian, dan bisa menariknya kembali saat dibutuhkan."
  },
  {
    question: "Bagaimana cara kerja 'Batas Aman Saldo'?",
    answer: "Anda bisa mengatur jumlah minimal saldo yang harus ada di dompet (misal: Rp 500.000). Jika saldo Anda turun di bawah angka tersebut, Dashboard akan memunculkan peringatan merah agar Anda lebih berhemat."
  },
  {
    question: "Apakah bisa edit atau hapus transaksi?",
    answer: "Tentu saja! Sekarang Anda bisa mengedit atau menghapus transaksi yang salah input melalui menu Laporan. Cukup klik ikon pensil (edit) atau tong sampah (hapus) pada tabel transaksi."
  },
  {
    question: "Bisa download laporan dalam format apa?",
    answer: "Saat ini kami mendukung format Excel (.xlsx) yang rapi dan profesional, sehingga Anda bisa mengolah data lebih lanjut di Microsoft Excel atau Google Sheets."
  },
  {
    question: "Apakah bisa diakses dari handphone?",
    answer: "Tentu saja. Website Dompetku responsif dan menyesuaikan tampilan dengan layar HP, Tablet, maupun Desktop."
  },
];

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 bg-gray-50/30">
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-100 text-blue-600 mb-6 shadow-sm">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Pertanyaan Umum</h1>
              <p className="text-gray-600 max-w-lg mx-auto">
                Temukan jawaban cepat untuk pertanyaan yang sering diajukan seputar fitur dan keamanan Dompetku.
              </p>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FaqItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-20 text-center border-t border-gray-200 pt-10">
              <h3 className="text-xl font-bold mb-2 text-gray-900">Masih Ada Pertanyaan?</h3>
              <p className="text-gray-600 mb-6">
                Jika pertanyaanmu belum terjawab, jangan ragu untuk menghubungi tim support kami.
              </p>
              <a 
                href="mailto:support@dompetku.id" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
              >
                Hubungi Support
              </a>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
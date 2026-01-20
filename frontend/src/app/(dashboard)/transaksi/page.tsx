"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  FileText, 
  DollarSign, 
  Lightbulb,
  CheckCircle,
  Loader2,
  ExternalLink,
  Tag 
} from "lucide-react";
import { api } from "@/lib/api"; // Ini akan otomatis pakai api.ts yang sudah kita perbaiki
import toast from "react-hot-toast";

// DATABASE KATEGORI (TAXONOMY)
const CATEGORIES = {
  INCOME: [
    { value: "Gaji & Tunjangan", label: "Gaji & Tunjangan" },
    { value: "Bonus & THR", label: "Bonus / THR" },
    { value: "Usaha / Bisnis", label: "Hasil Usaha / Bisnis" },
    { value: "Investasi", label: "Hasil Investasi" },
    { value: "Hadiah & Hibah", label: "Pemberian (Orang Tua/Teman)" },
    { value: "Temuan / Tak Terduga", label: "Temuan / Tak Terduga" },
    { value: "Lainnya", label: "Pemasukan Lainnya" },
  ],
  EXPENSE: [
    { value: "Makanan & Minuman", label: "Makanan & Minuman" },
    { value: "Transportasi", label: "Transportasi (Bensin/Ojol)" },
    { value: "Belanja Rutin", label: "Belanja Bulanan" },
    { value: "Tagihan & Utilitas", label: "Listrik/Air/Internet" },
    { value: "Tempat Tinggal", label: "Kos / Kontrakan" },
    { value: "Kesehatan", label: "Kesehatan / Obat" },
    { value: "Hiburan", label: "Hiburan & Hobi" },
    { value: "Pendidikan", label: "Pendidikan" },
    { value: "Sosial", label: "Sedekah / Sumbangan" },
    { value: "Cicilan / Utang", label: "Bayar Cicilan" },
    { value: "Lainnya", label: "Pengeluaran Lainnya" },
  ]
};

export default function InputTransaksiPage() {
  const router = useRouter();
  
  // State Form
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE"); 
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 
  
  const [loading, setLoading] = useState(false);

  // LOGIC: AUTO-RESET KATEGORI SAAT GANTI TIPE
  useEffect(() => {
    setCategory("");
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!amount || Number(amount) <= 0) {
      toast.error("Nominal tidak valid");
      setLoading(false);
      return;
    }
    if (!category) {
      toast.error("Mohon pilih kategori transaksi");
      setLoading(false);
      return;
    }

    try {
      // Mengirim data menggunakan api instance yang sudah membawa Token
      await api.post("/transactions", {
        type, 
        amount: Number(amount), 
        category,
        description,
        date: new Date(date).toISOString(),
      });

      toast.success((t) => (
        <div className="flex flex-col gap-1">
          <span className="font-bold">Tercatat!</span>
          <span className="text-xs text-slate-500">{category}: {description}</span>
          <Link
            href="/dashboard"
            className="text-blue-600 text-xs font-semibold flex items-center gap-1 mt-1 hover:underline"
            onClick={() => toast.dismiss(t.id)}
          >
            Cek Dashboard <ExternalLink size={10} />
          </Link>
        </div>
      ), { duration: 4000 });

      // Reset Form
      setAmount("");
      setDescription("");
      setCategory("");
      
      // Refresh Dashboard agar angka berubah
      router.refresh();

    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk mengambil list kategori berdasarkan tipe
  const currentCategories = type === "INCOME" ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-sans text-slate-800">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Input Transaksi</h1>
        <p className="mt-1 text-slate-500">
          Catat aliran uangmu agar keuangan tetap sehat.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. JENIS TRANSAKSI SELECTOR */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Jenis Transaksi</label>
            <div className="grid grid-cols-2 gap-4">
              
              <button
                type="button"
                onClick={() => setType("INCOME")}
                className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  type === "INCOME"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-100 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                   type === "INCOME" ? "bg-emerald-200" : "bg-slate-100"
                }`}>
                  <ArrowUpRight size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold">Pemasukan</p>
                  <p className="text-xs opacity-80">Uang masuk</p>
                </div>
                {type === "INCOME" && (
                  <div className="absolute top-4 right-4 text-emerald-600">
                    <CheckCircle size={18} fill="currentColor" className="text-emerald-100" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setType("EXPENSE")}
                className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  type === "EXPENSE"
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-slate-100 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                   type === "EXPENSE" ? "bg-rose-200" : "bg-slate-100"
                }`}>
                  <ArrowDownLeft size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold">Pengeluaran</p>
                  <p className="text-xs opacity-80">Uang keluar</p>
                </div>
                {type === "EXPENSE" && (
                  <div className="absolute top-4 right-4 text-rose-600">
                    <CheckCircle size={18} fill="currentColor" className="text-rose-100" />
                  </div>
                )}
              </button>

            </div>
          </div>

          {/* 2. KATEGORI (DROPDOWN) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Kategori</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Tag size={18} />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-white appearance-none cursor-pointer text-slate-700"
              >
                <option value="" disabled>Pilih Kategori</option>
                {currentCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {/* Panah Dropdown Custom */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* 3. NOMINAL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nominal (Rp)</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <DollarSign size={18} />
              </div>
              <input
                type="number"
                placeholder="0"
                min="1"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || parseFloat(val) >= 0) setAmount(val);
                }}
                onKeyDown={(e) => {
                  if (["-", "e", "E"].includes(e.key)) e.preventDefault();
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-300 font-medium text-lg"
                required
              />
            </div>
          </div>

          {/* 4. KETERANGAN */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Keterangan Tambahan</label>
            <div className="relative">
              <div className="absolute left-3 top-4 text-slate-400">
                <FileText size={18} />
              </div>
              <textarea
                rows={2}
                placeholder={type === "INCOME" ? "Contoh: Transfer dari Mama" : "Contoh: Nasi Padang Sederhana"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-300 resize-none"
                required
              />
            </div>
          </div>

          {/* 5. TANGGAL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tanggal Transaksi</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Calendar size={18} />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-600"
                required
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              type === "INCOME" 
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200" 
                : "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
            } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Transaksi"
            )}
          </button>

        </form>
      </div>

      {/* TIPS BOX */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
        <div className="text-amber-500 mt-1">
          <Lightbulb size={20} fill="currentColor" />
        </div>
        <div className="text-sm text-slate-600 leading-relaxed">
          <strong>Tips Kategori:</strong>
          <ul className="list-disc ml-4 mt-1 space-y-1">
            <li>Gunakan <strong>"Hadiah & Hibah"</strong> untuk uang pemberian orang tua/kerabat.</li>
            <li>Gunakan <strong>"Temuan"</strong> jika menemukan uang di jalan.</li>
            <li>Pisahkan <strong>"Belanja Rutin"</strong> (bulanan) dengan jajan harian.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
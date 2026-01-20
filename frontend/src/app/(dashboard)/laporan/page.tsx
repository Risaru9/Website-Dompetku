"use client";

import { useState, useMemo, useEffect } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { formatRupiah } from "@/lib/format";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { 
  Search, Filter, ArrowUpRight, ArrowDownLeft, 
  ChevronLeft, ChevronRight, Trash2, Edit, 
  Loader2, X, AlertTriangle, Save
} from "lucide-react";

const CATEGORIES = {
  INCOME: [
    "Gaji & Tunjangan", "Bonus & THR", "Usaha / Bisnis", "Investasi", 
    "Hadiah & Hibah", "Temuan", "Lainnya"
  ],
  EXPENSE: [
    "Makanan & Minuman", "Transportasi", "Belanja Rutin", "Tagihan & Utilitas", 
    "Tempat Tinggal", "Kesehatan", "Hiburan", "Pendidikan", "Sosial", "Cicilan / Utang", "Lainnya"
  ]
};

export default function LaporanPage() {
  const { data: transactions, loading, mutate } = useTransactions();
  
  // --- STATE UNTUK MODAL ---
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<number | null>(null);
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);

  // --- STATE FILTER ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- LOGIC: FILTERING (SUDAH DIPERBAIKI) ---
  const filteredData = useMemo(() => {
    // 🛡️ PENGAMAN ANTI-CRASH
    // Jika transactions null/undefined, kita pakai array kosong []
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    return safeTransactions.filter((tx) => {
      const term = searchTerm.toLowerCase();
      
      // Pencarian aman (cek jika description ada isinya)
      const matchSearch = 
        (tx.description && tx.description.toLowerCase().includes(term)) || 
        (tx.category && tx.category.toLowerCase().includes(term));
      
      const matchType = filterType === "ALL" || tx.type === filterType;
      
      let matchDate = true;
      if (startDate || endDate) {
        const txDate = new Date(tx.date).getTime();
        const start = startDate ? new Date(startDate).setHours(0,0,0,0) : null;
        const end = endDate ? new Date(endDate).setHours(23,59,59,999) : null;
        
        if (start && txDate < start) matchDate = false;
        if (end && txDate > end) matchDate = false;
      }
      return matchSearch && matchType && matchDate;
    });
  }, [transactions, searchTerm, filterType, startDate, endDate]);

  // --- LOGIC: SUMMARY ---
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    // filteredData dijamin array karena perbaikan di atas, jadi aman di-forEach
    filteredData.forEach((tx) => {
      if (tx.type === "INCOME") income += tx.amount;
      else expense += tx.amount;
    });
    return { income, expense, balance: income - expense };
  }, [filteredData]);

  // FITUR 1: CUSTOM DELETE MODAL LOGIC
  const openDeleteModal = (id: number) => {
    setSelectedTxId(id);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setSelectedTxId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTxId) return;
    setIsProcessing(true);
    try {
      await api.delete(`/transactions/${selectedTxId}`);
      toast.success("Transaksi berhasil dihapus");
      mutate();
      closeDeleteModal();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus");
    } finally {
      setIsProcessing(false);
    }
  };

  //FITUR 2: EDIT / UPDATE LOGIC
  const openEditModal = (tx: any) => {
    // Isi form dengan data yang mau diedit
    setEditFormData({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      category: tx.category,
      description: tx.description,
      date: new Date(tx.date).toISOString().split('T')[0]
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await api.put(`/transactions/${editFormData.id}`, {
        type: editFormData.type,
        amount: Number(editFormData.amount),
        category: editFormData.category,
        description: editFormData.description,
        date: new Date(editFormData.date).toISOString()
      });
      toast.success("Transaksi berhasil diperbarui!");
      mutate(); // Refresh data
      setIsEditOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal update transaksi");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#F8F9FA] font-sans text-slate-800 relative">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Laporan Keuangan</h1>
        <p className="mt-1 text-slate-500">Lihat dan filter riwayat transaksi Anda.</p>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4 text-slate-900 font-semibold">
          <Filter size={18} /> <h3>Filter</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search */}
          <div className="md:col-span-4 relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input type="text" placeholder="Cari transaksi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none text-sm" />
          </div>
          {/* Type Buttons */}
          <div className="md:col-span-4 flex bg-white gap-2">
            {[
              { label: "Semua", value: "ALL" },
              { label: "Masuk", value: "INCOME" },
              { label: "Keluar", value: "EXPENSE" }
            ].map((opt) => (
              <button key={opt.value} onClick={() => setFilterType(opt.value as any)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  filterType === opt.value ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
          {/* Date Range */}
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="md:col-span-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="md:col-span-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
          <p className="text-sm font-medium text-emerald-600 mb-1">Total Masuk</p>
          <h3 className="text-2xl font-bold text-emerald-700">{formatRupiah(summary.income)}</h3>
        </div>
        <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100">
          <p className="text-sm font-medium text-rose-600 mb-1">Total Keluar</p>
          <h3 className="text-2xl font-bold text-rose-700">{formatRupiah(summary.expense)}</h3>
        </div>
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
          <p className="text-sm font-medium text-blue-600 mb-1">Selisih</p>
          <h3 className="text-2xl font-bold text-blue-700">{formatRupiah(summary.balance)}</h3>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-100 px-6 py-4 text-xs font-semibold text-slate-500">
          <div className="col-span-2">Tanggal</div> 
          <div className="col-span-2">Jenis</div>
          <div className="col-span-4">Keterangan</div>
          <div className="col-span-2 text-right">Nominal</div>
          <div className="col-span-2 text-center">Aksi</div>
        </div>

        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-10 text-center text-slate-400 text-sm">Memuat data...</div>
          ) : filteredData.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">Tidak ada transaksi ditemukan</div>
          ) : (
            filteredData.map((tx) => (
              <div key={tx.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50 transition-colors group">
                <div className="col-span-2 text-sm text-slate-500">
                  {new Date(tx.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" })}
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium border ${
                    tx.type === 'INCOME' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                  }`}>
                    {tx.type === 'INCOME' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                    {tx.type === 'INCOME' ? "Masuk" : "Keluar"}
                  </span>
                </div>
                <div className="col-span-4 text-sm font-medium text-slate-700 truncate pr-4">
                  {tx.description || tx.category}
                </div>
                <div className={`col-span-2 text-right text-sm font-bold ${
                   tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {tx.type === 'INCOME' ? "+" : "-"}{formatRupiah(tx.amount)}
                </div>
                <div className="col-span-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(tx)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => openDeleteModal(tx.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/*MODAL 1: KONFIRMASI HAPUS (DELETE)*/}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-rose-100 p-3 rounded-full text-rose-600 mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Transaksi?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={closeDeleteModal}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*MODAL 2: EDIT TRANSAKSI */}
      {isEditOpen && editFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Edit Transaksi</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              
              {/* Jenis & Nominal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Jenis</label>
                  <select 
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="INCOME">Pemasukan</option>
                    <option value="EXPENSE">Pengeluaran</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Nominal (Rp)</label>
                  <input 
                    type="number" 
                    value={editFormData.amount}
                    onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Kategori</label>
                <select 
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  required
                >
                  <option value="" disabled>Pilih Kategori</option>
                  {(editFormData.type === "INCOME" ? CATEGORIES.INCOME : CATEGORIES.EXPENSE).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Keterangan */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Keterangan</label>
                <input 
                  type="text" 
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  required
                />
              </div>

              {/* Tanggal */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Tanggal</label>
                <input 
                  type="date" 
                  value={editFormData.date}
                  onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Simpan Perubahan</>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
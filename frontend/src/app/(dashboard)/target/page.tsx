"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatRupiah } from "@/lib/format";
import toast from "react-hot-toast";
import { 
  Plus, 
  Target, 
  Trash2, 
  TrendingUp, 
  X, 
  Loader2, 
  Save,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle // Import icon peringatan
} from "lucide-react";

export default function TargetPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal Create
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Modal Transaksi (Tabung/Tarik)
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");

  // State Modal Hapus (Delete) - BARU DITAMBAHKAN
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetToDelete, setTargetToDelete] = useState<number | null>(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/goals");
      const rawData = res.data;
      const cleanData = Array.isArray(rawData) ? rawData : (rawData.data || []);
      setGoals(cleanData);
    } catch (error) {
      console.error("Gagal ambil data goal", error);
      setGoals([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Fungsi Buat Target Baru
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/goals", {
        name: newName,
        targetAmount: Number(newTarget)
      });
      toast.success("Target berhasil dibuat");
      setNewName("");
      setNewTarget("");
      setIsCreateOpen(false);
      fetchGoals();
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat target");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi Handle Transaksi (Simpan atau Tarik)
  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      if (transactionType === "DEPOSIT") {
        await api.put(`/goals/${selectedGoal.id}/save`, {
          amount: Number(transactionAmount)
        });
        toast.success("Berhasil menabung");
      } else {
        await api.put(`/goals/${selectedGoal.id}/withdraw`, {
          amount: Number(transactionAmount)
        });
        toast.success("Berhasil menarik saldo");
      }

      setTransactionAmount("");
      setSelectedGoal(null);
      setIsTransactionOpen(false);
      fetchGoals();
    } catch (error: any) {
      toast.error(error.message || "Gagal memproses transaksi");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LOGIKA HAPUS DENGAN MODAL KEREN ---
  const openDeleteModal = (id: number) => {
    setTargetToDelete(id);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setTargetToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!targetToDelete) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/goals/${targetToDelete}`);
      toast.success("Target berhasil dihapus");
      fetchGoals();
      closeDeleteModal();
    } catch (error) {
      toast.error("Gagal menghapus target");
    } finally {
      setIsSubmitting(false);
    }
  };
  // ---------------------------------------

  const openTransactionModal = (goal: any) => {
    setSelectedGoal(goal);
    setTransactionType("DEPOSIT"); 
    setTransactionAmount("");
    setIsTransactionOpen(true);
  };

  const safeGoals = Array.isArray(goals) ? goals : [];

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Target Tabungan</h1>
          <p className="mt-1 text-slate-500">
            Tetapkan tujuan dan pantau progres tabunganmu.
          </p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
        >
          <Plus size={18} />
          Buat Target Baru
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Memuat data...</div>
      ) : safeGoals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
          <div className="bg-slate-50 p-4 rounded-full mb-4 text-slate-400">
            <Target size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">Belum ada target</h3>
          <p className="text-slate-400 text-sm max-w-xs text-center mt-1">
            Mulai menabung untuk impianmu hari ini dengan membuat target baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeGoals.map((goal) => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <div key={goal.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow relative overflow-hidden">
                {isCompleted && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                    TERCAPAI
                  </div>
                )}
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <Target size={24} />
                    </div>
                    {/* Tombol Hapus memanggil Modal */}
                    <button 
                      onClick={() => openDeleteModal(goal.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-1">{goal.name}</h3>
                  <div className="flex items-end gap-1 mb-4">
                    <span className="text-2xl font-bold text-slate-800">
                      {formatRupiah(goal.currentAmount)}
                    </span>
                    <span className="text-xs text-slate-400 mb-1">
                      / {formatRupiah(goal.targetAmount)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isCompleted ? "bg-emerald-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>{progress.toFixed(0)}%</span>
                    <span>{isCompleted ? "Selesai" : "Berjalan"}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button 
                    onClick={() => openTransactionModal(goal)}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors bg-slate-900 text-white hover:bg-slate-800"
                  >
                    <TrendingUp size={16} />
                    Kelola Saldo
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL 1: CREATE GOAL --- */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Buat Target Baru</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Target</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    placeholder="Contoh: Beli Laptop"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Target Nominal (Rp)</label>
                  <input 
                    type="number" 
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Simpan Target"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: KELOLA TRANSAKSI --- */}
      {isTransactionOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800">Kelola Saldo</h3>
                <p className="text-xs text-slate-500">{selectedGoal.name}</p>
              </div>
              <button onClick={() => setIsTransactionOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleTransaction} className="p-6">
              
              <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setTransactionType("DEPOSIT")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    transactionType === "DEPOSIT"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <ArrowUpCircle size={16} /> Menabung
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType("WITHDRAW")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    transactionType === "WITHDRAW"
                      ? "bg-white text-rose-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <ArrowDownCircle size={16} /> Tarik Saldo
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  {transactionType === "DEPOSIT" ? "Jumlah Setor (Rp)" : "Jumlah Tarik (Rp)"}
                </label>
                <input 
                  type="number" 
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold text-lg"
                  placeholder="0"
                  required
                />
                <p className="text-xs text-slate-400 mt-2">
                  Saldo tabungan saat ini: <span className="text-slate-700 font-bold">{formatRupiah(selectedGoal.currentAmount)}</span>
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 ${
                   transactionType === "DEPOSIT" 
                    ? "bg-emerald-600 hover:bg-emerald-700" 
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> 
                    {transactionType === "DEPOSIT" ? "Simpan Tabungan" : "Tarik Saldo"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: KONFIRMASI HAPUS (MODERN UI) --- */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              
              {/* Icon Peringatan */}
              <div className="bg-rose-100 p-3 rounded-full text-rose-600 mb-4">
                <AlertTriangle size={32} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Target Ini?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Apakah Anda yakin ingin menghapus target ini? Semua riwayat tabungan di dalamnya juga akan hilang.
              </p>

              <div className="flex gap-3 w-full">
                <button 
                  onClick={closeDeleteModal}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Ya, Hapus"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
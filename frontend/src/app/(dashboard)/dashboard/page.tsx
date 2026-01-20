"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  AlertCircle, // Icon baru untuk Warning
  Settings,
  X,
  Save,
  Loader2,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  Lightbulb
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSummary } from "@/hooks/useSummary";
import { useCashflow } from "@/hooks/useCashflow";
import { useTransactions } from "@/hooks/useTransactions";
import { formatRupiah } from "@/lib/format";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

const RANGE_OPTIONS = [
  { label: "7 Hari", value: "7d" },
  { label: "1 Bulan", value: "1m" },
  { label: "1 Tahun", value: "1y" },
  { label: "Semua", value: "all" },
];

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [range, setRange] = useState("7d");
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [limitInput, setLimitInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Ref untuk melacak status notifikasi terakhir agar tidak spam
  const notificationStatusRef = useRef<"none" | "warning" | "danger">("none");

  // 1. INIT STATE DARI LOCALSTORAGE
  const [saldoLimit, setSaldoLimit] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saldoLimit');
      return saved ? Number(saved) : 0;
    }
    return 0;
  });

  const { data: summary, loading: summaryLoading } = useSummary();
  const { data: cashflow, loading: cashflowLoading } = useCashflow(range);
  const { data: allTransactions, loading: txLoading } = useTransactions();

  // 2. FETCH PROFILE (SINKRONISASI SERVER)
  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const res = await api.get(`/users/profile?t=${new Date().getTime()}`);
        const serverLimit = res.data.saldoLimit;
        
        if (serverLimit && serverLimit > 0) {
          setSaldoLimit(serverLimit);
          localStorage.setItem('saldoLimit', String(serverLimit));
        }
      } catch (err) {
        console.error("Gagal sinkronisasi limit", err);
      }
    };
    if (isAuthenticated) fetchLimit();
  }, [isAuthenticated]);

  const totalIncome = summary?.totalIncome ?? 0;
  const totalExpense = summary?.totalExpense ?? 0;
  const balance = summary?.balance ?? 0;

  // --- LOGIKA BARU: ZONA BAHAYA VS ZONA WARNING ---
  // Kita buat buffer 20%. Contoh: Limit 1jt. Warning aktif jika saldo antara 1jt s/d 1.2jt.
  const warningThreshold = saldoLimit + (saldoLimit * 0.20); 

  // KUNING: Saldo di atas limit TAPI di bawah threshold (Mendekati)
  const isWarning = saldoLimit > 0 && balance >= saldoLimit && balance <= warningThreshold;

  // MERAH: Saldo benar-benar di bawah limit
  const isDanger = saldoLimit > 0 && balance < saldoLimit;

  // 3. TRIGGER NOTIFIKASI TOAST (MERAH & KUNING)
  useEffect(() => {
    if (!summaryLoading && saldoLimit > 0) {
      
      // KONDISI MERAH (BAHAYA)
      if (isDanger) {
        if (notificationStatusRef.current !== "danger") {
          toast.error(`BAHAYA! Saldo (${formatRupiah(balance)}) di bawah batas aman!`, {
            duration: 6000,
            icon: '🚨',
            style: { border: '1px solid #F43F5E', color: '#BE123C' },
          });
          notificationStatusRef.current = "danger";
        }
      } 
      // KONDISI KUNING (WARNING)
      else if (isWarning) {
        if (notificationStatusRef.current !== "warning") {
          toast(`Hati-hati! Saldo mendekati batas aman.`, {
            duration: 5000,
            icon: '⚠️',
            style: { border: '1px solid #EAB308', color: '#854D0E', backgroundColor: '#FEFCE8' },
          });
          notificationStatusRef.current = "warning";
        }
      } 
      // KONDISI AMAN
      else {
        notificationStatusRef.current = "none";
      }
    }
  }, [balance, saldoLimit, summaryLoading, isDanger, isWarning]);

  const chartData = useMemo(() => {
    if (!cashflow?.labels || !cashflow?.income || !cashflow?.expense) return [];
    return cashflow.labels.map((label, index) => ({
      name: label,
      income: cashflow.income[index] || 0,
      expense: cashflow.expense[index] || 0
    }));
  }, [cashflow]);

  const recentTransactions = Array.isArray(allTransactions) ? allTransactions.slice(0, 5) : [];

  const openSettingModal = () => {
    setLimitInput(saldoLimit.toString());
    setIsSettingOpen(true);
  };

  const handleUpdateLimit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const newVal = Number(limitInput);
      await api.put("/users/saldo-limit", { saldoLimit: newVal });
      
      setSaldoLimit(newVal);
      localStorage.setItem('saldoLimit', String(newVal));
      
      notificationStatusRef.current = "none"; // Reset status notifikasi saat limit diubah
      toast.success("Batas aman saldo diperbarui");
      setIsSettingOpen(false);
    } catch (error) {
      // Fallback local storage jika server error
      const newVal = Number(limitInput);
      setSaldoLimit(newVal);
      localStorage.setItem('saldoLimit', String(newVal));
      toast.error("Disimpan di browser (Server sibuk)");
      setIsSettingOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const formatYAxis = (value) => {
    if (value === 0) return "0";
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1).replace(/\.0$/, '')}M`;
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1).replace(/\.0$/, '')}jt`;
    if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}rb`;
    return `Rp ${value}`;
  };

  if (authLoading) return <div className="h-screen flex justify-center items-center"><Loader2 className="animate-spin"/></div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 font-sans text-slate-800 relative">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Halo, {user?.name || "User"}! 👋
          </h1>
          <p className="mt-1 text-slate-500">
            Berikut ringkasan keuangan Anda hari ini.
          </p>
        </div>
        
        <button 
          onClick={openSettingModal}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
        >
          <Settings size={18} />
          Atur Batas Aman
        </button>
      </div>

      {/* --- ALERT BANNER LOGIC --- */}
      
      {/* 1. ALERT MERAH (BAHAYA) */}
      {isDanger && (
        <div className="mb-8 bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-500 shadow-sm">
          <div className="bg-rose-100 p-2 rounded-lg text-rose-600 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-rose-700 text-lg">Peringatan: Saldo Kritis!</h3>
            <p className="text-rose-600 text-sm mt-1">
              Sisa saldo Anda <strong>{formatRupiah(balance)}</strong>, sudah melewati batas aman ({formatRupiah(saldoLimit)}).
            </p>
          </div>
        </div>
      )}

      {/* 2. ALERT KUNING (WARNING / MENDEKATI) */}
      {isWarning && !isDanger && (
        <div className="mb-8 bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-500 shadow-sm">
          <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600 shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-yellow-700 text-lg">Hati-hati: Mendekati Batas!</h3>
            <p className="text-yellow-700 text-sm mt-1">
              Saldo Anda <strong>{formatRupiah(balance)}</strong> hampir menyentuh batas aman ({formatRupiah(saldoLimit)}). Mulai berhemat!
            </p>
          </div>
        </div>
      )}

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pemasukan</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {summaryLoading ? "..." : formatRupiah(totalIncome)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <TrendingDown size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pengeluaran</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-1">
              {summaryLoading ? "..." : formatRupiah(totalExpense)}
            </h3>
          </div>
        </div>

        {/* SALDO CARD DENGAN WARNA DINAMIS */}
        <div className={`bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between h-40 relative overflow-hidden transition-colors duration-300
          ${isDanger ? 'border-rose-200 bg-rose-50/30' : isWarning ? 'border-yellow-200 bg-yellow-50/30' : 'border-slate-100'}
        `}>
          <div className={`h-10 w-10 flex items-center justify-center rounded-lg z-10
            ${isDanger ? 'bg-rose-100 text-rose-600' : isWarning ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-50 text-blue-600'}
          `}>
            <Wallet size={20} />
          </div>
          <div className="z-10">
            <p className="text-sm font-medium text-slate-500">Saldo Saat Ini</p>
            <h3 className={`text-2xl font-bold mt-1 
              ${isDanger ? 'text-rose-600' : isWarning ? 'text-yellow-600' : 'text-blue-600'}
            `}>
              {summaryLoading ? "..." : formatRupiah(balance)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              Batas Aman: {formatRupiah(saldoLimit)}
            </p>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* CHART SECTION */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Arus Keuangan</h2>
              <p className="text-sm text-slate-500">
                Pemasukan (Sumbu Kiri) vs Pengeluaran (Sumbu Kanan)
              </p>
            </div>
            
            <div className="flex bg-slate-50 p-1 rounded-lg">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRange(opt.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    range === opt.value
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[300px] w-full">
            {cashflowLoading ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                Memuat Grafik...
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} tickLine={false} interval={0} angle={-30} textAnchor="end" height={60} tick={{fontSize: 10, fill: '#64748b'}} dy={10}
                    tickFormatter={(value) => range === '1m' ? value.split(' ')[0] : value}
                  />
                  <YAxis yAxisId="incomeAxis" orientation="left" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#10b981'}} tickFormatter={formatYAxis} width={80} />
                  <YAxis yAxisId="expenseAxis" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#f43f5e'}} tickFormatter={formatYAxis} width={80} />
                  <Tooltip formatter={(value) => formatRupiah(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area yAxisId="incomeAxis" type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="Pemasukan" />
                  <Area yAxisId="expenseAxis" type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name="Pengeluaran" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                <p>Belum ada data transaksi</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-4">
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-xs text-slate-500">Pemasukan</span></div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><span className="text-xs text-slate-500">Pengeluaran</span></div>
          </div>
        </div>

        {/* TRANSAKSI TERBARU */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Transaksi Terbaru</h2>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
          </div>
          <div className="space-y-4 flex-1 overflow-auto">
            {txLoading ? (
              <div className="text-center text-sm text-slate-400 py-10">Memuat transaksi...</div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center text-sm text-slate-400 py-10">Belum ada transaksi</div>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 flex items-center justify-center rounded-xl ${
                      tx.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {tx.type === 'INCOME' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors capitalize">
                          {tx.description || "Tanpa Keterangan"}
                        </p>
                      <p className="text-xs text-slate-400">
                        {new Date(tx.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'INCOME' ? "+" : "-"}{formatRupiah(tx.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL SETTING */}
      {isSettingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Atur Batas Aman</h3>
              <button onClick={() => setIsSettingOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateLimit} className="p-6">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 mb-2">Minimal Saldo (Rp)</label>
                <input 
                  type="number" 
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold text-lg"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-slate-400 mt-2">Peringatan KUNING akan muncul jika saldo mendekati angka ini (selisih 20%).</p>
              </div>
              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Simpan Pengaturan</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
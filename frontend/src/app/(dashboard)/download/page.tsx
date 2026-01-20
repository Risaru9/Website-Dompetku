"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { FileSpreadsheet, Calendar, Download, Loader2, Check, PenTool, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function DownloadPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State Preset
  const [activePreset, setActivePreset] = useState("CUSTOM");

  // State Fitur Baru: Custom Filename
  const [useCustomName, setUseCustomName] = useState(false);
  const [customName, setCustomName] = useState("");

  const handlePreset = (type) => {
    setActivePreset(type);
    
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (type) {
      case "7D":
        start.setDate(today.getDate() - 7);
        break;
      
      case "THIS_MONTH":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      
      case "1Y":
        start.setFullYear(today.getFullYear() - 1);
        break;

      case "ALL":
        start = new Date("2000-01-01"); 
        break;
    }

    const formatDate = (d) => d.toISOString().split('T')[0];
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  };

  const handleManualDateChange = (isStart, value) => {
    setActivePreset("CUSTOM");
    if (isStart) setStartDate(value);
    else setEndDate(value);
  };

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      toast.error("Mohon tentukan rentang tanggal");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/transactions/export`, {
        params: { startDate, endDate },
        responseType: "blob", 
      });

      let fileName = `Laporan_Keuangan_${startDate}_sd_${endDate}.xlsx`;
      
      if (useCustomName && customName.trim() !== "") {
        fileName = customName.endsWith(".xlsx") ? customName : `${customName}.xlsx`;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Laporan berhasil diunduh");
    } catch (error) {
      console.error("Download error:", error);
      if (error.response && error.response.status === 404) {
        toast.error("Fitur Export belum dipasang di Backend (Error 404)");
      } else {
        toast.error("Gagal mengunduh laporan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIX LAYOUT: w-full dan mx-auto memastikan elemen berada DI TENGAH (Horizontal Center)
    <div className="p-8 w-full max-w-4xl mx-auto space-y-8 font-sans text-slate-800">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Download Laporan</h1>
        <p className="mt-1 text-slate-500">
          Unduh arsip transaksi keuangan Anda ke dalam format Excel.
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* SECTION HEADER DALAM CARD */}
        <div className="flex items-center gap-4 mb-8">
           <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
             <FileSpreadsheet size={24} />
           </div>
           <div>
             <h3 className="text-lg font-bold text-slate-900">Export Excel</h3>
             <p className="text-sm text-slate-500">Pilih periode data yang ingin diunduh</p>
           </div>
        </div>

        {/* 1. PRESET BUTTONS */}
        <div className="space-y-3 mb-6">
          <label className="text-sm font-medium text-slate-700">Pilih Periode Cepat</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "7 Hari", value: "7D" },
              { label: "Bulan Ini", value: "THIS_MONTH" },
              { label: "1 Tahun", value: "1Y" },
              { label: "Semua Data", value: "ALL" }
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => handlePreset(btn.value)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                  activePreset === btn.value
                    ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-200" 
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {activePreset === btn.value && <Check size={14} />}
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. DATE RANGE INPUTS (Style disamakan dengan InputTransaksi) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Dari Tanggal */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Dari Tanggal</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Calendar size={18} />
              </div>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => handleManualDateChange(true, e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all cursor-pointer font-medium bg-white"
              />
            </div>
          </div>

          {/* Sampai Tanggal */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Sampai Tanggal</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Calendar size={18} />
              </div>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => handleManualDateChange(false, e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all cursor-pointer font-medium bg-white"
              />
            </div>
          </div>
        </div>

        {/* 3. CUSTOM FILENAME */}
        <div className="space-y-2 mb-8">
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-2">
               <PenTool size={16} className="text-slate-500" />
               <label className="text-sm font-medium text-slate-700 cursor-pointer" onClick={() => setUseCustomName(!useCustomName)}>
                 Gunakan Nama File Kustom
               </label>
            </div>
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={useCustomName} 
                onChange={() => setUseCustomName(!useCustomName)} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
            </label>
          </div>
          
          {useCustomName && (
             <div className="relative mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FileText size={18} />
                </div>
                <input 
                  type="text" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Contoh: Laporan Keuangan Januari"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                />
             </div>
          )}
        </div>

        {/* 4. ACTION BUTTON */}
        <button 
          onClick={handleDownload}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-base hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Sedang Memproses...
            </>
          ) : (
            <>
              <Download size={20} />
              Download Excel (.xlsx)
            </>
          )}
        </button>

      </div>
    </div>
  );
}
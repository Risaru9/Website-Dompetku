"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useCashflow(range: string) {
  const [data, setData] = useState<{ 
    labels: string[]; 
    income: number[]; 
    expense: number[] 
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Panggil API
        const res = await api.get(`/summary/cashflow?range=${range}`);
        
        // 🛡️ UNWRAPPING DATA (Buka Bungkus)
        // Pastikan kita mendapatkan objek { labels: [], income: [], expense: [] }
        const rawData = res.data;
        const cleanData = rawData.data || rawData;

        // Validasi sederhana agar grafik tidak error
        if (cleanData && Array.isArray(cleanData.labels)) {
           setData(cleanData);
        } else {
           // Jika data kosong/format salah, kasih data default kosong agar tidak crash
           setData({ labels: [], income: [], expense: [] });
        }

      } catch (err: any) {
        console.error("Gagal ambil cashflow:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  return { data, loading, error };
}
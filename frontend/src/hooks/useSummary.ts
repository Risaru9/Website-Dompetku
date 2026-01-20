"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function useSummary() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/summary");
        
        if (mounted) {
          // 🛡️ UNWRAPPING DATA (Buka Bungkus)
          // Ambil res.data. Jika di dalamnya ada .data lagi, ambil itu.
          const rawData = res.data;
          const cleanData = rawData.data || rawData;
          
          setData(cleanData);
        }
      } catch (err: any) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}
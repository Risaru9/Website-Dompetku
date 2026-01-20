import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";

export const useTransactions = () => {
  const [data, setData] = useState<any[]>([]); // Default array kosong
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/transactions");
      
      const rawData = res.data;
      const cleanData = Array.isArray(rawData) ? rawData : (rawData.data || []);

      setData(cleanData);
    } catch (err) {
      console.error("Gagal mengambil data transaksi:", err);
      // Jangan set data jadi null, biarkan array kosong agar tidak crash
      setData([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { 
    data, 
    loading, 
    mutate: fetchTransactions // Fungsi untuk refresh data manual
  };
};
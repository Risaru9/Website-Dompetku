"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface Transaction {
  id: number;
  type: "INCOME" | "EXPENSE"; // Sesuaikan dengan enum Prisma Anda
  amount: number;
  category: string;
  description: string;
  date: string;
}

export function useTransactions() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Request ke backend. Asumsi endpoint GET /api/transactions ada
        const res = await api.get<{ data: Transaction[] }>("/transactions");
        setData(res.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface Transaction {
  id: number;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category?: string;
  description?: string;
  createdAt: string;
}

export function useRecentTransactions(limit: number = 5) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    api
      .get<Transaction[]>(`/transactions?limit=${limit}`)
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [limit]);

  return { data, loading, error };
}

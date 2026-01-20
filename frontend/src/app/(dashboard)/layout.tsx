"use client";

import { useState, useEffect } from "react";
// Gunakan @ untuk merujuk ke folder src langsung
import Sidebar from "@/components/layout/Sidebar"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto ml-64">
        {children}
      </main>
    </div>
  );
}
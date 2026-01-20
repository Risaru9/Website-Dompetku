"use client";

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      
      <Toaster 
        position="bottom-right" // 👈 Posisi di Bawah Kanan
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          // 👇 Style Futuristik & Clean
          style: {
            background: '#ffffff', // Putih bersih
            color: '#1e293b',      // Teks abu-gelap (Slate-800) agar kontras & enak dibaca
            border: '1px solid #e2e8f0', // Border tipis (Slate-200)
            padding: '16px',       // Padding lega
            borderRadius: '16px',  // Sudut membulat modern (Rounded-2xl)
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Shadow lembut
            fontSize: '14px',
            fontFamily: 'var(--font-inter), sans-serif', // Mengikuti font aplikasi
            maxWidth: '400px',     // Lebar maksimal agar rapi
          },
          // Kustomisasi Icon Sukses
          success: {
            iconTheme: {
              primary: '#10b981', // Hijau Emerald cerah
              secondary: '#ecfdf5', // Background icon hijau muda
            },
          },
          // Kustomisasi Icon Error
          error: {
            iconTheme: {
              primary: '#f43f5e', // Merah Rose cerah
              secondary: '#fff1f2',
            },
          },
        }}
      />
    </>
  );
}
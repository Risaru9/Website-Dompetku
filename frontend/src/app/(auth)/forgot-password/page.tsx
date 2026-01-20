"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, KeyRound, Loader2, Mail } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Card from "@/components/ui/Card";    // Pastikan path ini benar sesuai struktur Anda
import Input from "@/components/ui/Input";  // Pastikan path ini benar
import Button from "@/components/ui/Button"; // Pastikan path ini benar

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tembak Endpoint Backend yang baru kita buat
      const res = await fetch("http://localhost:5000/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengirim email reset.");
      }

      // Sukses!
      toast.success("Link reset telah dikirim ke email Anda! Cek Inbox (Mailtrap).", {
        duration: 5000, // Tampil agak lama biar user baca
        icon: '📧',
      });
      
      // Opsional: Bersihkan form
      setEmail("");

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50 relative font-sans">
      <Toaster position="top-center" />

      {/* Tombol Kembali */}
      <div className="absolute top-8 left-4 md:left-8">
        <Link 
          href="/login" 
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white/80 px-4 py-2 rounded-full border border-slate-200 hover:border-slate-400"
        >
          <ChevronLeft size={20} />
          Kembali ke Login
        </Link>
      </div>

      <Card>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <KeyRound size={24} />
        </div>
        
        <h1 className="text-center text-xl font-bold text-slate-900">Lupa Password?</h1>
        <p className="mt-2 text-center text-sm text-slate-500 max-w-xs mx-auto">
          Jangan panik. Masukkan email Anda di bawah ini, kami akan mengirimkan link untuk membuat password baru.
        </p>

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <Input
            label="Email Terdaftar"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            required
          />

          <Button disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" /> Mengirim Email...
              </span>
            ) : (
              "Kirim Link Reset"
            )}
          </Button>
        </form>
      </Card>
    </main>
  );
}
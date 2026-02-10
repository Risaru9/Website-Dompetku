"use client";

import { useState, use } from "react"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// 👇 1. Import API Helper
import { api } from "@/lib/api"; 

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter();
  const { token } = use(params); 

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Password tidak sama!");
      return;
    }

    setLoading(true);

    try {
      // 👇 2. Gunakan api.post (Otomatis deteksi Localhost/Vercel)
      await api.post(`/users/reset-password/${token}`, { 
        password, 
        confirmPassword 
      });

      // Jika sukses
      toast.success("Berhasil! Password Anda telah diperbarui.", { duration: 3000 });
      
      // Redirect ke Login
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      // Tangkap Error dari Backend
      const errorMessage = err.response?.data?.message || "Gagal mereset password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50 font-sans">
      <Toaster position="top-center" />
      
      <Card>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Lock size={24} />
        </div>
        <h1 className="text-center text-xl font-bold text-slate-900">Buat Password Baru</h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Silakan masukkan password baru Anda.
        </p>

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <Input
            label="Password Baru"
            type={showPass ? "text" : "password"}
            placeholder="Minimal 8 karakter"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            icon={<Lock size={16} />}
            required
            rightSlot={
                <button type="button" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={18} className="text-slate-400"/> : <Eye size={18} className="text-slate-400"/>}
                </button>
            }
          />
          
          <Input
            label="Konfirmasi Password"
            type="password"
            placeholder="Ulangi password baru"
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            icon={<CheckCircle2 size={16} />}
            required
          />

          <Button disabled={loading}>
            {loading ? <><Loader2 className="animate-spin" /> Menyimpan...</> : "Simpan Password Baru"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
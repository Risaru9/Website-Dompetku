"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth"; 
import Card from "@/components/ui/Card";    
import Input from "@/components/ui/Input";  
import Button from "@/components/ui/Button"; 
import { Mail, Lock, Eye, EyeOff, ChevronLeft, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; 
import Cookies from "js-cookie";
import { api } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // 1. Bersihkan session lama
    Cookies.remove("token", { path: "/" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 2. Call BACKEND LANGSUNG (BENER)
    const res = await api.post("/users/login", {
      email,
      password,
    });

    const data = res.data;

    const finalToken = data.token || data.data?.token;
    const finalUser = data.user || data.data?.user;

    if (!finalToken || !finalUser) {
      toast.error("Login gagal: data tidak lengkap");
      setLoading(false);
      return;
    }

    // 3. Simpan Token
    Cookies.set("token", finalToken, {
      expires: 1,
      path: "/",
      sameSite: "lax",
    });

    localStorage.setItem("token", finalToken);
    localStorage.setItem("user", JSON.stringify(finalUser));

    // 4. Update Auth Context
    login(finalToken, finalUser);

    toast.success(`Selamat datang, ${finalUser.name}! 👋`);

    // 5. Redirect
    setTimeout(() => {
      router.refresh();
      router.replace("/dashboard");
    }, 1000);

  } catch (err: any) {
    console.error("LOGIN ERROR:", err);

    toast.error(
      err?.response?.data?.message ||
      "Email atau password salah"
    );

    setLoading(false);
  }
};


  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50 relative font-sans">
      <Toaster position="top-center" />
      {/* ... (SISA KODE TAMPILAN SAMA SEPERTI SEBELUMNYA) ... */}
      
      {/* Tombol Kembali */}
      <div className="absolute top-8 left-4 md:left-8 z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white border border-slate-200 hover:border-slate-400 shadow-sm"
        >
          <ChevronLeft size={20} />
          Kembali ke Beranda
        </Link>
      </div>

      <Card>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg">
          <Mail size={20} />
        </div>
        <h1 className="text-center text-xl font-bold text-slate-900">Masuk ke Dompetku</h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          Selamat datang kembali! Masuk untuk melanjutkan.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            required
          />
          
          <Input
            label="Password"
            type={showPassword ? "text" : "password"} 
            placeholder="Masukkan password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            icon={<Lock size={16} />}
            required
            rightSlot={
              <button
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <div className="flex justify-end">
            <Link 
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
            >
              Lupa password?
            </Link>
          </div>

          <Button disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" /> Masuk...
              </span>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-slate-900 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </Card>
    </main>
  );
}
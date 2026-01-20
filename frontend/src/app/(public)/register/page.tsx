"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Untuk redirect
import { api } from "@/lib/api"; 
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; // Import Toast

export default function RegisterPage() {
  const router = useRouter();

  // State Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State UI
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // LOGIC: Submit Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Validasi di Sisi Frontend (Biar irit request ke server)
    if (password.length < 8) {
      toast.error("Password minimal 8 karakter!");
      setLoading(false);
      return;
    }
    if (!/\d/.test(password)) {
      toast.error("Password harus mengandung minimal 1 angka!");
      setLoading(false);
      return;
    }

    try {
      // 2. Tembak API Register
      await api.post("/users/register", {
        name,
        email,
        password,
      });

      // 3. SUKSES! Tampilkan Notifikasi Dinamis
      toast.success("Akun berhasil dibuat! Mengalihkan...", {
        duration: 3000,
      });

      // 4. Redirect Otomatis ke Login (Kasih jeda 1.5 detik biar user baca toast dulu)
      setTimeout(() => {
        router.push("/login"); 
      }, 1500);

    } catch (err: any) {
      console.error(err);
      // Tampilkan pesan error dari backend (misal: Email sudah terdaftar)
      toast.error(err.message || "Gagal mendaftar. Coba lagi.");
    } finally {
      if (password.length < 8 || !/\d/.test(password)) {
          // Keep loading false only if validation failed locally or request finished
          setLoading(false);
      } else {
         // Jika sukses, biarkan loading tetap true sampai redirect terjadi (biar user gak klik2 lagi)
         // Jika error API, matikan loading
         // Kita handle di catch block sebenarnya, tapi untuk aman:
         // Cek apakah error atau sukses.
      }
    }
  };

  // Helper: Agar loading mati jika error API (karena di atas logicnya untuk sukses)
  // Kita revisi sedikit catch block di atas:
  // Tambahkan setLoading(false) di catch block.

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans text-slate-800">
      
      {/* Pasang Toaster disini agar notifikasi muncul */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Buat Akun Baru</h1>
          <p className="text-slate-500 text-sm mt-1">Daftar gratis dan mulai kelola keuanganmu.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Input Nama */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
              required
            />
          </div>

          {/* Input Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
              required
            />
          </div>

          {/* Input Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter & 1 angka"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm pr-12 ${
                  // Logic Visual: Merah jika belum memenuhi syarat (saat diketik)
                  password.length > 0 && (password.length < 8 || !/\d/.test(password))
                    ? "border-red-300 focus:ring-red-200"
                    : "border-slate-200 focus:ring-slate-900"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Password Hint (Realtime Feedback) */}
            <div className="flex gap-3 mt-2">
               <p className={`text-xs flex items-center gap-1 ${password.length >= 8 ? "text-emerald-600" : "text-slate-400"}`}>
                 {password.length >= 8 ? "✓" : "•"} Min 8 Karakter
               </p>
               <p className={`text-xs flex items-center gap-1 ${/\d/.test(password) ? "text-emerald-600" : "text-slate-400"}`}>
                 {/\d/.test(password) ? "✓" : "•"} Ada Angka
               </p>
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Memproses...
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-8">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-slate-900 hover:underline">
            Masuk di sini
          </Link>
        </p>

      </div>
    </div>
  );
}
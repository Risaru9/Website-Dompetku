"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // 👈 WAJIB IMPORT INI

interface User {
  id: number;
  name: string;
  email: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // 1. FUNGSI LOGIN (Dipanggil dari Halaman Login)
  const login = (token: string, userData: User) => {
    // A. SIMPAN COOKIE (Untuk Middleware & Server) - WAJIB ADA path: '/'
    Cookies.set("token", token, { expires: 1, path: '/' }); 

    // B. SIMPAN LOCALSTORAGE (Untuk State React agar tidak hilang saat refresh)
    localStorage.setItem("token", token);
    localStorage.setItem("user_data", JSON.stringify(userData));

    // C. Update State
    setUser(userData);
    
    // D. Pindah Halaman
    router.refresh(); // Refresh agar Middleware baca cookie baru
    router.replace("/dashboard");
  };

  // 2. FUNGSI LOGOUT
  const logout = () => {
    // Hapus dari segala penjuru bumi
    Cookies.remove("token", { path: '/' }); // Hapus Cookie
    Cookies.remove("token"); 
    
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    
    setUser(null);
    router.replace("/login");
  };

  // 3. CEK SESI SAAT WEBSITE DIMUAT (Agar tidak logout sendiri saat refresh)
  useEffect(() => {
    const savedToken = Cookies.get("token") || localStorage.getItem("token");
    const savedUser = localStorage.getItem("user_data");

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        logout(); // Jika data rusak, logout sekalian
      }
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
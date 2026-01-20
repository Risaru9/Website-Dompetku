"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api"; 

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. Cek sesi saat refresh page (Dengan Try-Catch agar tidak error JSON)
  useEffect(() => {
    const initAuth = () => {
      const savedToken = Cookies.get("token");
      const savedUser = localStorage.getItem("user_data");

      if (savedToken && savedUser) {
        try {
          // Parsing aman: jika gagal, masuk ke catch
          const parsedUser = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(parsedUser);
        } catch (error) {
          console.error("Data user corrupt, melakukan reset...");
          // Bersihkan data rusak
          Cookies.remove("token");
          localStorage.removeItem("user_data");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  // 2. Fungsi Login
  const login = (newToken: string, newUser: User) => {
    Cookies.set("token", newToken, { expires: 1 }); 
    localStorage.setItem("user_data", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    router.push("/dashboard");
  };

  // 3. Fungsi Logout
  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user_data");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token, 
      login, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 👇 NAMA INI SUDAH DIPERBAIKI MENJADI 'useAuthContext'
// Agar sesuai dengan import di file src/hooks/useAuth.ts Anda
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
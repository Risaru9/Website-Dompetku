import axios from "axios";
import Cookies from "js-cookie";

// Pastikan URL Backend benar
const BASE_URL = "http://localhost:5000/api"; 

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // --- PERUBAHAN DI SINI ---
    // 1. Coba cari di Cookie dulu
    let token = Cookies.get("token");

    // 2. Kalau di Cookie kosong, CARI DI LOCALSTORAGE (Backup)
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("token") || undefined;
    }

    // LOG DETEKTIF
    console.log(`[API REQUEST] Ke: ${config.url}`);
    if (token) {
        console.log(`[TOKEN FOUND] Token ditemukan! (Panjang: ${token.length})`);
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.log(`[TOKEN MISSING] Sudah cari di Cookie & LocalStorage tapi nihil.`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Biarkan error lewat agar bisa didebug, jangan redirect otomatis dulu
    return Promise.reject(error);
  }
);
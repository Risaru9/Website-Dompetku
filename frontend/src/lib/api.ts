import axios from "axios";
import Cookies from "js-cookie";

// --- PERBAIKAN 1: URL DINAMIS ---
// Gunakan Environment Variable. Jika di Vercel, dia pakai link Vercel. 
// Jika di laptop (dev), dia baru pakai localhost.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; 

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // --- PERBAIKAN 2: MATIKAN CREDENTIALS ---
  // Karena backend kita setting "origin: '*'" (Boleh semua), 
  // maka browser MELARANG withCredentials: true.
  // Kita ubah jadi false agar tidak kena blokir CORS.
  withCredentials: false, 
});

api.interceptors.request.use(
  (config) => {
    // 1. Coba cari di Cookie dulu
    let token = Cookies.get("token");

    // 2. Kalau di Cookie kosong, CARI DI LOCALSTORAGE (Backup)
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("token") || undefined;
    }

    // LOG DETEKTIF (Bagus untuk debugging)
    console.log(`[API REQUEST] Ke: ${config.url}`);
    
    if (token) {
        // console.log(`[TOKEN FOUND] Token siap dikirim!`); // Opsional biar console bersih
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.log(`[TOKEN MISSING] User belum login / Token tidak ada.`);
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
    return Promise.reject(error);
  }
);
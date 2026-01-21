import axios from "axios";
import Cookies from "js-cookie";

// --- PERBAIKAN UTAMA: HARDCODE LINK BACKEND VERCEL ---
// Pastikan link ini SAMA PERSIS dengan link backend Anda yang sudah hijau di Vercel.
// Jangan ada spasi di ujungnya.
const BASE_URL = "https://dompetkuapi.vercel.app/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Wajib false karena backend kita setting origin: '*'
  withCredentials: false, 
});

api.interceptors.request.use(
  (config) => {
    // 1. Ambil token dari Cookie atau LocalStorage
    let token = Cookies.get("token");
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("token") || undefined;
    }

    // 2. Tempel token jika ada
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
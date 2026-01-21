import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "https://dompetkuapi.vercel.app/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    // 1. Coba cari di Cookie dulu
    let token = Cookies.get("token");

    // 2. Kalau di Cookie kosong, CARI DI LOCALSTORAGE
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("token") || undefined;
    }

    // LOG DETEKTIF
    console.log(`[API REQUEST] Ke: ${config.url}`);
    
    if (token) {
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
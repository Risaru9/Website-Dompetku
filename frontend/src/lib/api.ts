import axios from "axios";
import Cookies from "js-cookie";

// --- KITA TULIS LANGSUNG AGAR MENGABAIKAN .ENV YANG SALAH ---
const BASE_URL = "https://dompetkuapi.vercel.app/api"; 

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: false, // Wajib false
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    let token: string | undefined;
    if (typeof window !== "undefined") {
      token = Cookies.get("token") || localStorage.getItem("token") || undefined;
    }

    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("[API ERROR]", error.response.data);
    } else {
      console.error("[API ERROR]", error.message);
    }
    return Promise.reject(error);
  }
);
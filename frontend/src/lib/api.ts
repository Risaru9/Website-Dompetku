import axios from "axios";
import Cookies from "js-cookie";

// 1. HARDCODE URL (JANGAN PAKAI PROCESS.ENV BIAR TIDAK NYASAR KE LOCALHOST)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: false, // Sesuai setting CORS backend kamu
});

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
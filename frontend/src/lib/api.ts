import axios from "axios";
import Cookies from "js-cookie";

// 1. HARDCODE URL (JANGAN PAKAI PROCESS.ENV BIAR TIDAK NYASAR KE LOCALHOST)
const BASE_URL = "https://dompetkuapi.vercel.app"; 

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  // 2. MATIKAN CREDENTIALS (SANGAT PENTING!)
  // Agar tidak bentrok dengan 'Access-Control-Allow-Origin: *' di backend
  withCredentials: false, 
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
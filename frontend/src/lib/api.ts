import axios from "axios";
import Cookies from "js-cookie";

// Pastikan ENV ada
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  console.error("NEXT_PUBLIC_API_URL belum diset!");
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // Ambil token dengan aman (client-only)
    let token: string | undefined;

    if (typeof window !== "undefined") {
      token = Cookies.get("token") || localStorage.getItem("token") || undefined;
    }

    // Log aman
    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`);

    // Pasang Authorization jika token ada
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
      console.error(
        "[API ERROR]",
        error.response.status,
        error.response.data?.message || error.response.data
      );
    } else {
      console.error("[API ERROR]", error.message);
    }
    return Promise.reject(error);
  }
);

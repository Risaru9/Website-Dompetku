import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "https://dompetkuapi.vercel.app"; 


export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Wajib false
});

api.interceptors.request.use(
  (config) => {
    let token = Cookies.get("token");
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("token") || undefined;
    }

    console.log(`[API REQUEST] Ke: ${config.baseURL}${config.url}`);
    
    if (token) {
       config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
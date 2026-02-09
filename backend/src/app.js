require("dotenv").config();
const express = require("express");
const cors = require('cors'); 
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

// Import Routes
const userRoutes = require("./routers/userRoutes");
const transactionRoutes = require("./routers/transactionRoutes");
const summaryRoutes = require("./routers/summaryRoutes");
const exportRoutes = require("./routers/exportRoutes"); 
const swaggerSpec = require("./docs/swagger");
const goalRoutes = require("./routers/goalRoutes");

// Import Middleware Error
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// ==========================================
// 1. SETUP CORS (INI KUNCINYA)
// ==========================================
app.use(cors({
  origin: true, // Gunakan true agar otomatis mengizinkan origin pengirim
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true // Ubah ke TRUE agar Cookies/Token bisa lewat
}));

// PERBAIKAN UTAMA (CRASH FIX):
// Ganti '*' menjadi /(.*)/ agar tidak error "Missing parameter name"
app.options(/(.*)/, cors());

// 2. Middleware Security & Parsing
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Test Route (Root Check)
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "success", 
    message: "Backend Dompetku Berjalan Lancar!",
    timestamp: new Date()
  });
});

// 4. Routes API 
// PENTING: Saya tambahkan '/api' di sini agar cocok dengan Frontend Anda
// Frontend Anda menembak: http://localhost:5000/api/users/...
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/goals", goalRoutes);

// 5. Dokumentasi Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 6. Error Handler (Wajib paling bawah)
app.use(errorHandler);

// ==========================================
// 7. START SERVER (INI YANG HILANG)
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
  console.log(`=================================`);
});
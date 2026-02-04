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
// Kita setting agar semua domain boleh masuk (*)
// dan credentials dimatikan agar tidak bentrok.
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: false 
}));

// PENTING: Paksa Express merespon Preflight Request (OPTIONS)
// Ini sering kali menjadi penyebab error di Vercel
app.options('*', cors());

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
    message: "Backend Dompetku Berjalan Lancar di Vercel!",
    timestamp: new Date()
  });
});

// 4. Routes API 
// Vercel sudah mengarahkan /api ke folder api, 
// jadi di sini kita tidak perlu menulis /api lagi.
app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/summary", summaryRoutes);
app.use("/export", exportRoutes);
app.use("/goals", goalRoutes);

// 5. Dokumentasi Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 6. Error Handler (Wajib paling bawah)
app.use(errorHandler);

// 7. Export App (Wajib untuk Vercel Serverless)
module.exports = app;
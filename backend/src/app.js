require("dotenv").config();

const express = require("express");
const cors = require('cors');
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

// 1. Import Routes
const userRoutes = require("./routers/userRoutes");
const transactionRoutes = require("./routers/transactionRoutes");
const summaryRoutes = require("./routers/summaryRoutes");
const exportRoutes = require("./routers/exportRoutes"); 
const swaggerSpec = require("./docs/swagger");
const goalRoutes = require("./routers/goalRoutes");

// Import Middleware Error
const errorHandler = require("./middlewares/errorHandler");

// 2. Inisialisasi App
const app = express();

// 3. Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// SETUP CORS (PENTING AGAR FRONTEND BISA MASUK)
app.use(cors({
  origin: '*', // Mengizinkan semua domain (Vercel Frontend & Localhost)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 4. Test Route (Root)
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "success", 
    message: "Backend Dompetku berjalan dengan baik di Vercel!" 
  });
});

// 5. Pasang Routes API (PERUBAHAN UTAMA DISINI)
// Hapus prefix "/api" disini, karena Vercel sudah menambahkannya di depan.
// Jika tetap pakai "/api/users", nanti linknya jadi: domain.com/api/api/users (Double API)
app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/summary", summaryRoutes);
app.use("/export", exportRoutes);
app.use("/goals", goalRoutes);

// 6. Dokumentasi Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 7. Error Handler
app.use(errorHandler);

// 8. Server Listen (Hanya jalan di Local, Vercel akan mengabaikan ini tapi butuh export)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WAJIB ADA: Export app agar Vercel bisa menjalankannya
module.exports = app;
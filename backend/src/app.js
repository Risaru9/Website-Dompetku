require("dotenv").config();
const express = require("express");
const cors = require('cors'); // Cors harus paling atas
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

// Import Routes
const userRoutes = require("./routers/userRoutes");
const transactionRoutes = require("./routers/transactionRoutes");
const summaryRoutes = require("./routers/summaryRoutes");
const exportRoutes = require("./routers/exportRoutes"); 
const swaggerSpec = require("./docs/swagger");
const goalRoutes = require("./routers/goalRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// 1. SETUP CORS PALING PERTAMA (PENTING!)
// Agar request 'OPTIONS' tidak kena 405
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false 
}));

// 2. Middleware Lain
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());

// 3. Test Route (Root)
app.get("/", (req, res) => {
  res.json({ status: "Backend Live", message: "Server Vercel Berjalan!" });
});

// 4. Routes API 
// PENTING: Jangan pakai "/api" di sini karena folder Vercel sudah nambahin.
// Vercel mapping: /api/users -> masuk sini -> baca /users
app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/summary", summaryRoutes);
app.use("/export", exportRoutes);
app.use("/goals", goalRoutes);

// 5. Docs & Error
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);

// 6. Export untuk Vercel (WAJIB)
module.exports = app;
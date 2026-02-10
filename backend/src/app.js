require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

const userRoutes = require("./routers/userRoutes");
const transactionRoutes = require("./routers/transactionRoutes");
const summaryRoutes = require("./routers/summaryRoutes");
const exportRoutes = require("./routers/exportRoutes"); 
const goalRoutes = require("./routers/goalRoutes");
const swaggerSpec = require("./docs/swagger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// ==========================================
// 1. SETTING CORS MANUAL (ANTI-GAGAL)
// ==========================================
app.use((req, res, next) => {
  // Izinkan Siapapun (*)
  res.header("Access-Control-Allow-Origin", "*");
  // Izinkan Method ini
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  // Izinkan Header ini
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  
  // PENTING: JANGAN PAKAI 'Access-Control-Allow-Credentials: true' JIKA ORIGINNYA '*'
  
  // Jika browser tanya "Boleh masuk gak?" (Preflight/OPTIONS), langsung jawab "BOLEH"
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  
  next();
});

// 2. Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Test Route
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Backend Dompetku Live!" });
});

// 4. Routes
// Ingat: Vercel routing otomatis menghandle /api, jadi kita tidak perlu prefix /api disini
// jika di vercel.json destinationnya ke file ini.
app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/summary", summaryRoutes);
app.use("/export", exportRoutes);
app.use("/goals", goalRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);

module.exports = app;
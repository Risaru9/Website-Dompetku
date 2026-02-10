require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

// --- Import Routes ---
const userRoutes = require("./routers/userRoutes");
const transactionRoutes = require("./routers/transactionRoutes");
const summaryRoutes = require("./routers/summaryRoutes");
const exportRoutes = require("./routers/exportRoutes"); 
const goalRoutes = require("./routers/goalRoutes");
const swaggerSpec = require("./docs/swagger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Backend Dompetku Live!" });
});

app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/summary", summaryRoutes);
app.use("/export", exportRoutes);
app.use("/goals", goalRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`🚀 Backend Dompetku Live!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`-----------------------------------------`);
  });
}
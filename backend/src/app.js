require("dotenv").config();
const express = require("express");
const cors = require('cors'); 
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

const userRoutes = require("./routers/userRoutes");
const transactionRoutes = require("./routers/transactionRoutes");
const summaryRoutes = require("./routers/summaryRoutes");
const exportRoutes = require("./routers/exportRoutes"); 
const swaggerSpec = require("./docs/swagger");
const goalRoutes = require("./routers/goalRoutes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

const allowedOrigins = [
'http://localhost:3000',
  'http://localhost:5000',
  'https://dompetku.vercel.app',
  'https://website-dompetku-rk0dvdfkp-risaru9s-projects.vercel.app',
  'https://website-dompetku.vercel.app',
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: false
}));

app.options(/(.*)/, cors());

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "success", 
    message: "Backend Dompetku Berjalan Lancar!",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date()
  });
});

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/goals", goalRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export app untuk Vercel (Serverless)
module.exports = app;
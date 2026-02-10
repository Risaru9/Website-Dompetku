const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authLimiter } = require("../middlewares/rateLimiter");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ HANDLE PREFLIGHT OPTIONS (WAJIB UNTUK VERCEL)
router.options("*", (req, res) => {
  res.sendStatus(200);
});

// PUBLIC ROUTES
router.post("/register", authLimiter, userController.register);
router.post("/login", authLimiter, userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);

// PROTECTED ROUTES
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/saldo-limit", authMiddleware, userController.updateSaldoLimit);

module.exports = router;

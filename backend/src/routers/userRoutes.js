const express = require("express");
const router = express.Router();
// Kita gunakan satu controller saja biar rapi
const userController = require("../controllers/userController");
const { authLimiter } = require("../middlewares/rateLimiter");
const authMiddleware = require("../middlewares/authMiddleware");

// PUBLIC ROUTES (Tidak butuh login)
router.post("/register", authLimiter, userController.register);
router.post("/login", authLimiter, userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);

// PROTECTED ROUTES (Butuh Login / Token)
// Ini fitur baru Saldo Limit & Profile
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/saldo-limit", authMiddleware, userController.updateSaldoLimit);

module.exports = router;
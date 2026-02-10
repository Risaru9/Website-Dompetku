const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authLimiter } = require("../middlewares/rateLimiter");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", authLimiter, userController.register);
router.post("/login", authLimiter, userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/saldo-limit", authMiddleware, userController.updateSaldoLimit);

module.exports = router;

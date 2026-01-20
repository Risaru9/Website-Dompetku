const express = require("express");
const router = express.Router();

const {
  getSummary,
  getCashflow,
} = require("../controllers/summaryController");

const authMiddleware = require("../middlewares/authMiddleware");

// summary cards
router.get("/", authMiddleware, getSummary);

// 🔥 CASHFLOW (INI YANG KAMU PANGGIL)
router.get("/cashflow", authMiddleware, getCashflow);

module.exports = router;

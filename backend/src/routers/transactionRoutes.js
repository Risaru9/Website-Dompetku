const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const transactionController = require("../controllers/transactionController");

// --- ROUTES CRUD LENGKAP ---

// 1. Create (Tambah)
router.post("/", authMiddleware, transactionController.createTransaction);

// 2. EXPORT EXCEL
// WAJIB DITARUH SEBELUM 'GET /:id' AGAR TIDAK BENTROK
router.get("/export", authMiddleware, transactionController.downloadExcel);

// 3. Read (Lihat Semua)
router.get("/", authMiddleware, transactionController.getTransactions);

// 4. Update (Edit) - Butuh ID di URL
router.put("/:id", authMiddleware, transactionController.updateTransaction);

// 5. Delete (Hapus) - Butuh ID di URL
router.delete("/:id", authMiddleware, transactionController.deleteTransaction);

module.exports = router;
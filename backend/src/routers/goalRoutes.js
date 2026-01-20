const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const goalController = require("../controllers/goalController");

router.get("/", authMiddleware, goalController.getGoals);
router.post("/", authMiddleware, goalController.createGoal);
router.put("/:id/save", authMiddleware, goalController.addSavings);
router.put("/:id/withdraw", authMiddleware, goalController.withdrawSavings); // Route Baru
router.delete("/:id", authMiddleware, goalController.deleteGoal);

module.exports = router;
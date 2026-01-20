const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");

exports.getGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    return successResponse(res, "Data target berhasil diambil", goals);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Gagal mengambil data", 500);
  }
};

exports.createGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, targetAmount } = req.body;

    if (!name || !targetAmount) {
      return errorResponse(res, "Nama dan target wajib diisi", 400);
    }

    const goal = await prisma.goal.create({
      data: {
        name,
        targetAmount: Number(targetAmount),
        userId,
        currentAmount: 0
      }
    });

    return successResponse(res, "Target berhasil dibuat", goal, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Gagal membuat target", 500);
  }
};

exports.addSavings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { amount } = req.body;

    const goal = await prisma.goal.findUnique({ where: { id: Number(id) } });

    if (!goal || goal.userId !== userId) {
      return errorResponse(res, "Target tidak ditemukan", 404);
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: Number(id) },
      data: {
        currentAmount: { increment: Number(amount) }
      }
    });

    return successResponse(res, "Berhasil menabung", updatedGoal);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Gagal update saldo", 500);
  }
};

// ... fungsi createGoal, getGoals, addSavings yang sudah ada ...

// FUNGSI BARU: Tarik Saldo
exports.withdrawSavings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { amount } = req.body;

    const goal = await prisma.goal.findUnique({ where: { id: Number(id) } });

    if (!goal || goal.userId !== userId) {
      return errorResponse(res, "Target tidak ditemukan", 404);
    }

    // Validasi: Tidak boleh tarik lebih dari saldo yang ada
    if (goal.currentAmount < Number(amount)) {
      return errorResponse(res, "Saldo tabungan tidak mencukupi", 400);
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: Number(id) },
      data: {
        currentAmount: { decrement: Number(amount) }
      }
    });

    return successResponse(res, "Penarikan berhasil", updatedGoal);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Gagal menarik saldo", 500);
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const goal = await prisma.goal.findUnique({ where: { id: Number(id) } });

    if (!goal || goal.userId !== userId) {
      return errorResponse(res, "Target tidak ditemukan", 404);
    }

    await prisma.goal.delete({ where: { id: Number(id) } });
    return successResponse(res, "Target berhasil dihapus");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Gagal menghapus target", 500);
  }
};


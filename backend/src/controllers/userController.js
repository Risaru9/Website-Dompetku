const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../utils/response");

// 1. REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, "Semua field wajib diisi", 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse(res, "Email sudah terdaftar", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        saldoLimit: 0 // Default 0
      },
    });

    return successResponse(res, "Registrasi berhasil", {
      id: user.id,
      name: user.name,
      email: user.email,
    }, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Gagal registrasi", 500);
  }
};

// 2. LOGIN (FIX: Sekarang menghasilkan Token)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse(res, "Email atau password salah", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, "Email atau password salah", 401);
    }

    // PENTING: Generate Token JWT agar authMiddleware bekerja
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Kirim token via Cookie (Opsional, untuk keamanan ekstra)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
    });

    return successResponse(res, "Login berhasil", {
      token, // Kirim token ke frontend
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        saldoLimit: user.saldoLimit
      }
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Gagal login", 500);
  }
};

// 3. GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Didapat dari authMiddleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        saldoLimit: true,
        createdAt: true
      }
    });

    if (!user) return errorResponse(res, "User tidak ditemukan", 404);

    return successResponse(res, "Profil berhasil diambil", user);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Gagal mengambil profil", 500);
  }
};

// 4. UPDATE SALDO LIMIT
exports.updateSaldoLimit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { saldoLimit } = req.body;

    if (saldoLimit === undefined || saldoLimit < 0) {
      return errorResponse(res, "Nilai saldo limit tidak valid", 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { saldoLimit: Number(saldoLimit) },
      select: { id: true, saldoLimit: true }
    });

    return successResponse(res, "Batas saldo berhasil diperbarui", updatedUser);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Gagal memperbarui batas saldo", 500);
  }
};

// 5. PLACEHOLDER: Forgot Password (Agar tidak crash)
exports.forgotPassword = async (req, res) => {
    // Nanti diisi logika kirim email
    return errorResponse(res, "Fitur ini belum diaktifkan", 501);
};

// 6. PLACEHOLDER: Reset Password (Agar tidak crash)
exports.resetPassword = async (req, res) => {
    // Nanti diisi logika reset password
    return errorResponse(res, "Fitur ini belum diaktifkan", 501);
};
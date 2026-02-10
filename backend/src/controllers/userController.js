// controllers/userController.js
const crypto = require('crypto');
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { successResponse, errorResponse } = require("../utils/response");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
        saldoLimit: 0
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

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return successResponse(res, "Login berhasil", {
      token,
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

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log("-----------------------------------------");
    console.log("1. Menerima Request Lupa Password untuk:", email);

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      console.log("User tidak ditemukan. Mengirim respon palsu.");
      return successResponse(res, "Jika email terdaftar, link reset telah dikirim.");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 Jam

    await prisma.user.update({
          where: { email },
          data: { resetPasswordToken: resetToken, resetPasswordExpires: tokenExpiry },
        });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        console.log("Mencoba kirim email via GMAIL...");

    const mailOptions = {
      from: `"Dompetku Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Permintaan Reset Password - Dompetku",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563EB;">Reset Password</h2>
          <p>Klik tombol di bawah ini untuk mereset password Anda:</p>
          <a href="${resetUrl}" style="background-color: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password Saya</a>
          <p style="margin-top:20px; color:#666;">Link ini valid selama 1 jam.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email BERHASIL dikirim via Gmail!");
    return successResponse(res, "Link reset password telah dikirim.");

  } catch (error) {
    console.error("ERROR SERVER:", error);
    return errorResponse(res, "Gagal mengirim email", 500);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return errorResponse(res, "Password tidak cocok", 400);
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() }, 
      },
    });

    if (!user) {
      return errorResponse(res, "Token tidak valid atau sudah kadaluarsa.", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return successResponse(res, "Password berhasil diperbarui! Silakan login.");

  } catch (error) {
    console.error("Reset Password Error:", error);
    return errorResponse(res, "Gagal mereset password", 500);
  }
};
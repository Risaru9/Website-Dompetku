const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma"); // Menggunakan instance prisma yang sudah ada
const sendEmail = require('../utils/email');

// --- REGISTER ---
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi dasar
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: "Semua field wajib diisi" });
    }

    // Validasi kompleksitas password
    if (password.length < 8 || !/\d/.test(password)) {
        return res.status(400).json({ status: 'error', message: 'Password minimal 8 karakter dan mengandung angka.' });
    }

    // Cek duplikat email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ status: 'error', message: "Email sudah terdaftar" });
    }

    // Hash Password & Simpan
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return res.status(201).json({
        status: 'success',
        message: "Registrasi berhasil",
        data: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return res.status(500).json({ status: 'error', message: "Terjadi kesalahan server" });
  }
};

// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: "Email dan password wajib diisi" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ status: 'error', message: "Email atau password salah" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 'error', message: "Email atau password salah" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set Cookie untuk Frontend
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax'
    };
    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
        status: 'success',
        message: "Login berhasil",
        data: {
            token,
            user: { id: user.id, name: user.name, email: user.email }
        }
    });

  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    return res.status(500).json({ status: 'error', message: "Terjadi kesalahan server" });
  }
};

// --- FORGOT PASSWORD ---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Email tidak terdaftar' });
    }

    // Generate & Hash Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    await prisma.user.update({
      where: { email },
      data: { passwordResetToken, passwordResetExpires }
    });

    // Kirim Email
    // Note: Pastikan URL frontend sesuai env
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`; 
    const message = `Klik link ini untuk reset password (berlaku 10 menit): \n\n${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Reset Password Dompetku',
        message: message
      });

      res.status(200).json({ status: 'success', message: 'Email reset password telah dikirim.' });

    } catch (err) {
      await prisma.user.update({
        where: { email },
        data: { passwordResetToken: null, passwordResetExpires: null }
      });
      console.error("Email Error:", err);
      return res.status(500).json({ status: 'error', message: 'Gagal mengirim email.' });
    }

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ status: 'error', message: 'Terjadi kesalahan server' });
  }
};

// --- RESET PASSWORD ---
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Token tidak valid atau kadaluwarsa.' });
    }

    const { password, confirmPassword } = req.body;
    if(password !== confirmPassword) {
        return res.status(400).json({ status: 'error', message: 'Password tidak cocok.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });

    res.status(200).json({ status: 'success', message: 'Password berhasil diubah, silakan login.' });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ status: 'error', message: 'Terjadi kesalahan server' });
  }
};
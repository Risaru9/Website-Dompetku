const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { errorResponse } = require("../utils/response");

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Ambil token dari header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Akses ditolak. Token tidak tersedia.", 401);
    }

    // 2. Pecah token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return errorResponse(res, "Token tidak valid.", 401);
    }

    // 3. Verifikasi Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. CEK APAKAH USER BENAR-BENAR ADA DI DATABASE (PENTING!)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    // --- INI PENYEBAB LAYAR PUTIH ANDA SEBELUMNYA ---
    // Jika user sudah dihapus di DB tapi token masih ada di browser
    if (!user) {
      console.log("Middleware: Token valid tapi User tidak ditemukan di DB (Zombie Token)");
      return errorResponse(res, "User tidak valid atau sudah dihapus. Silakan login ulang.", 401);
    }

    // 5. Simpan data user ke request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    
    // Tangani jika token expired atau error lainnya
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, "Sesi berakhir. Silakan login kembali.", 401);
    }
    
    return errorResponse(res, "Token tidak valid.", 401);
  }
};

module.exports = authMiddleware;
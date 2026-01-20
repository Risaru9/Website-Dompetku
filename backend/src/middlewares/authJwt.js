const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

module.exports = async (req, res, next) => {
  try {
    // 1️⃣ Ambil header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: token tidak ditemukan",
      });
    }

    // 2️⃣ Format harus: Bearer <token>
    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: format token salah",
      });
    }

    // 3️⃣ Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Cari user di database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user tidak ditemukan",
      });
    }

    // 5️⃣ Inject user ke request
    req.user = user;

    // 6️⃣ Lanjut ke controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: token tidak valid",
    });
  }
};

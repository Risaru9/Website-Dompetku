const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { errorResponse } = require("../utils/response");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Akses ditolak. Silakan login.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return errorResponse(res, "Sesi tidak valid. Silakan login ulang.", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, "Token kadaluarsa atau tidak valid.", 401);
  }
};

module.exports = authMiddleware;
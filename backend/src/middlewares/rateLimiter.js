const rateLimit = require("express-rate-limit");

// limiter khusus auth (login & register)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // max 10 request per IP
  message: {
    success: false,
    message: "Terlalu banyak percobaan, coba lagi nanti",
  },
});

// limiter global (opsional)
exports.apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 100,
});

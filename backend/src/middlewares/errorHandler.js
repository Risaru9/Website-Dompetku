module.exports = (err, req, res, next) => {
  console.error("[UNHANDLED ERROR]", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Terjadi kesalahan server",
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url} →`, err.message);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res
      .status(409)
      .json({ success: false, message: `${field} is already taken.` });
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ success: false, message: "Validation failed", errors });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format." });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }

  if (err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ success: false, message: "Token has expired." });
  }

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ success: false, message: "File too large. Max 5MB allowed." });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
};

export default errorHandler;

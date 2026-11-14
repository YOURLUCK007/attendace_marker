const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-key");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(403).json({ message: "Unauthorized - no role" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden - insufficient permissions" });
    }
    next();
  };
};
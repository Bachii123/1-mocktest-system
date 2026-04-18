const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {

    const decoded = jwt.verify(token, "secretkey");

    req.user = decoded;   // ✅ VERY IMPORTANT

    next();

  } catch (error) {

    return res.status(401).json({ message: "Invalid token" });

  }

};

module.exports = authMiddleware;
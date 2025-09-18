const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error();

    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Non autorisé" });
  }
}

module.exports = requireAuth;

import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Please sign in to continue." });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Your session is invalid or expired." });
  }
}

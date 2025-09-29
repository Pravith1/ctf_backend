const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Token not verified yet." });
    }
    if (req.user.field !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      message: "Error checking admin role.",
      error: err.message,
    });
  }
};

module.exports = { isAdmin };

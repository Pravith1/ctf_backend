// Dummy middleware for testing
const verifyToken = (req, res, next) => next();
const isAdmin = (req, res, next) => next();

module.exports = { verifyToken, isAdmin };

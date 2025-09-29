const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    try {
		const token = req.cookies?.jwt;
		if (!token) {
			return res.status(401).json({ message: 'Access token missing' });
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log(decoded);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token.', error: err.message });
	}
}

module.exports = {verifyToken}
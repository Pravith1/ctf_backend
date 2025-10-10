const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    try {
		// Check Authorization header first, then cookie as fallback
		let token = null;
		
		// Check Authorization header (Bearer token)
		const authHeader = req.header('Authorization');
		if (authHeader && authHeader.startsWith('Bearer ')) {
			token = authHeader.replace('Bearer ', '');
		}
		
		// If no Authorization header, check cookie
		if (!token && req.cookies?.jwt) {
			token = req.cookies.jwt;
		}
		
		if (!token) {
			return res.status(401).json({ message: 'Access token missing. Please provide token in Authorization header or cookie.' });
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

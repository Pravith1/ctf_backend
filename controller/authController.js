const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper: Generate JWT

const generateAccessToken = (user) => {
	return jwt.sign(
		{ id: user._id, email: user.email, team_name: user.team_name, field: user.field },
		process.env.JWT_SECRET,
		{ expiresIn: '1d' }
	);
};

const generateRefreshToken = (user) => {
	return jwt.sign(
		{ id: user._id },
		process.env.JWT_REFRESH_SECRET,
		{ expiresIn: '7d' }
	);
};


// Signup (all fields required, only user role allowed here)
exports.signup = async (req, res) => {
	try {
		const { email, team_name, password, year } = req.body;
		if (!email || !team_name || !password || !year) {
			return res.status(400).json({ message: 'All fields are required.' });
		}
		// Check if user exists
		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(409).json({ message: 'Email already registered.' });
		}
		const hash = await bcrypt.hash(password, 10);
		const user = new User({
			email,
			team_name,
			password: hash,
			year,
			field: 'user'
		});
		await user.save();
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);
		// Set cookies
		res.cookie('jwt', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 1 * 24 * 60 * 60 * 1000 // 15 min
		});
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
		});
		res.status(201).json({ user: { email, team_name, year, field: user.field } });
	} catch (err) {
		res.status(500).json({ message: 'Signup failed', error: err.message });
	}
};


// Login
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password required.' });
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials.' });
		}
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(401).json({ message: 'Invalid credentials.' });
		}
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);
		// Set cookies
		res.cookie('jwt', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 1 * 24 * 60 * 60 * 1000 // 15 min
		});
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
		});
		res.status(200).json({ user: { email: user.email, team_name: user.team_name, year: user.year, field: user.field } });
	} catch (err) {
		res.status(500).json({ message: 'Login failed', error: err.message });
	}
};


// Logout: clear cookies
exports.logout = async (req, res) => {
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
	res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
	res.status(200).json({ message: 'Logged out successfully.' });
};

// Refresh token endpoint
exports.refresh = async (req, res) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) {
		return res.status(401).json({ message: 'No refresh token provided.' });
	}
	try {
		const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
		const user = await User.findById(payload.id);
		if (!user) {
			return res.status(401).json({ message: 'User not found.' });
		}
		const accessToken = generateAccessToken(user);
		res.cookie('jwt', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 1 * 24 * 60 * 60 * 1000// 15 min
		});
		res.status(200).json({ message: 'Token refreshed.' });
	} catch (err) {
		res.status(403).json({ message: 'Invalid refresh token.' });
	}
};

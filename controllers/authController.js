const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper: Generate JWT

const generateAccessToken = (user) => {
	return jwt.sign(
		{ id: user._id, email: user.email, team_name: user.team_name, field: user.field ,difficulty : user.difficulty},
		process.env.JWT_SECRET,
		{ expiresIn: '1d' }
	);
};
// Signup (all fields required, only user role allowed here)
exports.signup = async (req, res) => {
	try {
		const { email, team_name, password, year, difficulty } = req.body;
		if (!email || !team_name || !password || !year || !difficulty) {
			return res.status(400).json({ message: 'All fields are required.' });
		}
		// Validate email domain
		if (!email.endsWith('@psgtech.ac.in')) {
			return res.status(400).json({ message: 'Please use your official PSG Tech email (@psgtech.ac.in)' });
		}
		// Validate difficulty level
		if (!['beginner', 'intermediate'].includes(difficulty)) {
			return res.status(400).json({ message: 'Difficulty must be either "beginner" or "intermediate".' });
		}
		// Check if email already exists
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(409).json({ message: 'Email already registered.' });
		}
		// Check if team name already exists
		const existingTeamName = await User.findOne({ team_name });
		if (existingTeamName) {
			return res.status(409).json({ message: 'Team name already taken. Please choose a different team name.' });
		}
		const hash = await bcrypt.hash(password, 10);
		const user = new User({
			email,
			team_name,
			password: hash,
			year,
			difficulty,
			field: 'user'
		});
		await user.save();
		const accessToken = generateAccessToken(user);
		// Set cookie
		res.cookie('jwt', accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
  maxAge: 1 * 24 * 60 * 60 * 1000
		});
		res.status(201).json({ message: 'Signup successful!', user: { email, team_name, year, difficulty, field: user.field } });
	} catch (err) {
		// Handle MongoDB duplicate key error
		if (err.code === 11000) {
			const field = Object.keys(err.keyPattern)[0];
			if (field === 'email') {
				return res.status(409).json({ message: 'Email already registered.' });
			} else if (field === 'team_name') {
				return res.status(409).json({ message: 'Team name already taken. Please choose a different team name.' });
			}
		}
		return res.status(500).json({ message: err.message || 'Signup failed. Please try again.' });
	}
};


// Login
exports.login = async (req, res) => {
	try {
		const { team_name, password } = req.body;
		if (!team_name || !password) {
			return res.status(400).json({ message: 'Team name and password are required.' });
		}
		const user = await User.findOne({ team_name });
		if (!user) {
			return res.status(401).json({ message: 'Team name not found. Please check your team name or sign up.' });
		}
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(401).json({ message: 'Incorrect password. Please try again.' });
		}
		const accessToken = generateAccessToken(user);
		// Set cookie
		res.clearCookie('jwt', { 
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 1 * 24 * 60 * 60 * 1000 
});
		res.status(200).json({ message: 'Login successful!', user: { email: user.email, team_name: user.team_name, year: user.year, difficulty: user.difficulty, field: user.field } });
	} catch (err) {
		return res.status(500).json({ message: err.message || 'Login failed. Please try again.' });
	}
};


// Logout: clear cookies
exports.logout = async (req, res) => {
	res.clearCookie('jwt', { httpOnly: true,secure: true,
  sameSite:'none',
  maxAge: 1 * 24 * 60 * 60 * 1000 });
	res.status(200).json({ message: 'Logged out successfully.' });
};



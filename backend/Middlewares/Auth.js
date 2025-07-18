// Middlewares/Auth.js
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const ensureAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(403).json({ error: 'Invalid token user' });
        }

        req.user = { email: decoded.email }; // Attach to request
        next();
    } catch (err) {
        console.error("Auth error:", err);
        res.status(403).json({ error: 'Invalid token' });
    }
};

module.exports = ensureAuthenticated;

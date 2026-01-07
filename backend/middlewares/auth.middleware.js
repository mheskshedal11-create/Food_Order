import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {
    try {
        // 1. Get token from cookies or Authorization header
        const token = req.cookies.access_token ||
            req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please login first.'
            });
        }
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

        // 3. Find user by decoded id (exclude password)
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found or has been deleted'
            });
        }
        // 5. Attach user to request object
        req.user = user;

        // 6. Call next middleware
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
    }
};
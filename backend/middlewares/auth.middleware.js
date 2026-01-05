import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {
    try {
        // 1. Get token from cookies or headers
        const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login first.'
            });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        console.log("Decoded token:", decoded);
        // 3. Find user by decoded id
        // Use findById instead of findOne(decoded.id)
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // 4. Attach user to request object
        // so that next middleware/controller can access it
        req.user = user;

        // 5. Call next() properly
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

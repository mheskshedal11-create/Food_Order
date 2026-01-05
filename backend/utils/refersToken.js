import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const generateRefreshToken = async (userId) => {
    // Create refresh token
    const token = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN,
        { expiresIn: '7d' }
    )

    // Save in DB
    await User.findByIdAndUpdate(
        userId,
        { $set: { refresh_token: token } },
        { new: true } // optional
    )

    return token
}

export default generateRefreshToken

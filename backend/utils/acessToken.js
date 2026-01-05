import jwt from 'jsonwebtoken'

const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN,
        { expiresIn: '5h' }
    )
}

export default generateAccessToken

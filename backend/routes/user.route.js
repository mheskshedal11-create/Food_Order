import express from 'express'
import { forgotPasswordController, loginController, logoutController, registerController } from '../controllers/user.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { loginRateLimit, OtpRateLimit } from '../helper/rateLimit.js'
const userRouter = express.Router()

userRouter.post('/register', registerController)
userRouter.post('/login', loginRateLimit, loginController)
userRouter.post('/logout', authMiddleware, logoutController)
userRouter.post('/forgot-password', OtpRateLimit, forgotPasswordController)
export default userRouter
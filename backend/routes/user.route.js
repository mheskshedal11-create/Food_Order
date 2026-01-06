import express from 'express'
import { createNewPasswordController, forgotPasswordController, loginController, logoutController, registerController, verifyOtpController } from '../controllers/user.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { loginRateLimit, OtpRateLimit } from '../helper/rateLimit.js'
const userRouter = express.Router()

userRouter.post('/register', registerController)
userRouter.post('/login', loginRateLimit, loginController)
userRouter.post('/logout', authMiddleware, logoutController)
userRouter.post('/forgot-password', OtpRateLimit, forgotPasswordController)
userRouter.put('/opt-verify', verifyOtpController)
userRouter.put('/reset-password', createNewPasswordController)
export default userRouter
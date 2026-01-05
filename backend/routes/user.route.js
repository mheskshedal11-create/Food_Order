import express from 'express'
import { loginController, logoutController, registerController } from '../controllers/user.controller.js'
const userRouter = express.Router()

userRouter.post('/register', registerController)
userRouter.post('/login', loginController)
userRouter.post('/logout', logoutController)
export default userRouter
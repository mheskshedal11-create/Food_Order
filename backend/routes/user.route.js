import express from 'express'
import { loginController, registerController } from '../controllers/user.controller.js'
const userRouter = express.Router()

userRouter.post('/register', registerController)
userRouter.post('/login', loginController)
export default userRouter
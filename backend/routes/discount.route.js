import express from 'express'
import { createDiscountController } from '../controllers/discount.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import authorizedRole from '../middlewares/authorizeRole.js'
import validateError from '../validations/Errorhandling.js'
import { discountValidation } from '../validations/discount.js'
const discountRouter = express.Router()
discountRouter.post('/create', authMiddleware, authorizedRole('admin'), discountValidation, validateError, createDiscountController)

export default discountRouter
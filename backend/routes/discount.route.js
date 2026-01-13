import express from 'express'
import { createDiscountController, updateDiscountController, deleteDiscountController } from '../controllers/discount.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import authorizedRole from '../middlewares/authorizeRole.js'
import validateError from '../validations/Errorhandling.js'
import { discountValidation } from '../validations/discount.js'
const discountRouter = express.Router()

discountRouter.post('/create', authMiddleware, authorizedRole('admin'), discountValidation, validateError, createDiscountController)
discountRouter.patch('/update/:id', authMiddleware, authorizedRole('admin'), discountValidation, validateError, updateDiscountController)
discountRouter.delete('/delete/:id', authMiddleware, authorizedRole('admin'), deleteDiscountController);

export default discountRouter
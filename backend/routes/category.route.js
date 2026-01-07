import express from 'express';
import { createCategoryController, getAllCategoryController, getCategoryByIdController } from '../controllers/category.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import categoryValidate from '../validations/cateogry.js'
import validateError from '../validations/Errorhandling.js';
import authorizedRole from '../middlewares/authorizeRole.js';

const categoryRouter = express.Router();

// Route to create category (admin only)
categoryRouter.post('/create', authMiddleware, authorizedRole('admin'), categoryValidate, validateError, createCategoryController);
categoryRouter.get('/get-all-category', authMiddleware, authorizedRole('admin'), getAllCategoryController)
categoryRouter.get('/get/:Id', authMiddleware, authorizedRole('admin'), getCategoryByIdController)
export default categoryRouter;
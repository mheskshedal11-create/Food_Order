import express from 'express'
import { createItemController } from '../controllers/item.controller.js'
import authorizedRole from '../middlewares/authorizeRole.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
const itemRouter = express.Router()
itemRouter.post('/', authMiddleware, authorizedRole('admin'), createItemController)
export default itemRouter
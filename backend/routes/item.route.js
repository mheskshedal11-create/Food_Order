import express from 'express'
import { createItemController, deleteItemController, getItemController, updateItemController } from '../controllers/item.controller.js'
import authorizedRole from '../middlewares/authorizeRole.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
const itemRouter = express.Router()
itemRouter.post('/', authMiddleware, authorizedRole('admin'), createItemController)
itemRouter.get('/get-all', getItemController)
itemRouter.get('/get-item/:itemId', authMiddleware, getItemController)
itemRouter.patch('/update/:id', authMiddleware, authorizedRole('admin'), updateItemController)
itemRouter.delete('/delete/:id', authMiddleware, authorizedRole('admin'), deleteItemController)
export default itemRouter
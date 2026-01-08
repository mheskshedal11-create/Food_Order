import express from 'express'
import { createItemController, getItemController } from '../controllers/item.controller.js'
import authorizedRole from '../middlewares/authorizeRole.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
const itemRouter = express.Router()
itemRouter.post('/', authMiddleware, authorizedRole('admin'), createItemController)
itemRouter.get('/get-all', getItemController)
itemRouter.get('/get-item/:id', authorizedRole, getItemController)
export default itemRouter
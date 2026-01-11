import express from 'express'
import { getAllItemsController, getItemByIdController, searchItemsController } from '../controllers/search.controller.js'
const searchRouter = express.Router()
searchRouter.post('/search', searchItemsController)
searchRouter.get('/all', getAllItemsController);
searchRouter.get('/:itemId', getItemByIdController);
export default searchRouter
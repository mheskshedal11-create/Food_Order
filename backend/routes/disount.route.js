import express from 'express'
import { createDsicount } from '../controllers/discount.controller.js'
import { disconnect } from 'mongoose'
const descountRouter = express.Router()
disconnect.post('/', createDsicount)
export default descountRouter
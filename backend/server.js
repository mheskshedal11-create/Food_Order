import express from 'express'
import 'dotenv/config'
import morgan from 'morgan'
import helmet from 'helmet'
import Connection from './db/db.js'
import globalError from './middlewares/globalError.js'
import userRouter from './routes/user.route.js'
import cookieParser from 'cookie-parser'
import categoryRouter from './routes/category.route.js'
import itemRouter from './routes/item.route.js'


const app = express()
const PORT = process.env.PORT

//for json format
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(morgan('dev'))
app.use(helmet())
app.use(cookieParser())

//global Error handling
app.use(globalError)

//api 
app.use('/api/v1/user', userRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/item', itemRouter)

//dbconnection 
Connection().then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`)
    })
})
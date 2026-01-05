import express from 'express'
import 'dotenv/config'
import morgan from 'morgan'
import helmet from 'helmet'
import Connection from './db/db.js'
import globalError from './middlewares/globalError.js'
import userRouter from './routes/user.route.js'

const app = express()
const PORT = process.env.PORT

//for json format
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(morgan('dev'))
app.use(helmet())

//global Error handling
app.use(globalError)

//api 
app.use('/api/v1/user', userRouter)

//dbconnection 
Connection().then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`)
    })
})
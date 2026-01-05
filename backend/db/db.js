import mongoose from 'mongoose'

const Connection = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database connect Successfully')
    } catch (error) {
        console.log(error)
    }
}
export default Connection
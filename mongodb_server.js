const mongoose = require('mongoose')

const initMongoDB = async () => {
    const connection = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB is running at ${connection.connection.host}`)
}

module.exports = initMongoDB
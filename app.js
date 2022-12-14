require('dotenv').config()
const port = process.env.API_PORT || 9999
const initMongoDB = require('./mongodb_server')
const express = require('express')
const cors = require('cors')
// const bodyParser = require('body-parser')
const app = express()


//middleware
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
// app.use(bodyParser.json())

//routes/controllers
app.use('/api/products', require('./controllers/productsController'))
app.use('/api/authentication', require('./controllers/authenticationController'))

//initialize
initMongoDB()
app.listen(port, () => console.log(`WebApi is running on http://localhost:${port}`))


require('dotenv').config()
const port = process.env.WEBAPI_PORT || 6000
const initMongodb = require('./mongodb_server')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

//middleware
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// routes
const ProductController = require('./controllers/ProductsController')
app.use('/api/products', ProductController)


// Starting api
initMongodb()
app.listen(port, () => console.log(`WebApi is running on http://localhost:${port}`)) 
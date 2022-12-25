const express = require('express')
const controller = express.Router()

const productSchema = require('../schemas/productSchema')

// Unsafe routes

// Get's

controller.route('/').get(async(req, res) => {
    const products = []
    const list = await productSchema.find()
    if(list){
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else 
        res.status(400).json()
})

controller.route('/:tag').get(async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag })
    if(list){
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else 
        res.status(400).json()
})

controller.route('/:tag/:take').get( async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag }).limit(req.params.take)
    if(list){
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else 
        res.status(400).json()
})

controller.route('/product/details/:articleNumber').get( async (req, res) => {
    const product = await productSchema.findById(req.params.articleNumber)
    if(product) {
        res.status(200).json ({
            articleNumber: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            tag: product.tag,
            imageName: product.imageName,
            rating: product.rating
    })
    } else 
        res.status(404).json()
})


// Safe routes

//Post
controller.route('/').post(async (req, res) => {
    const { name, description, price, category, tag, imageName, rating} = req.body

    if (!name || !price)
        res.status(400).json({text: 'name and price is required'})

    const product_exists = await productSchema.findOne({name})
    if (product_exists)
        res.status(409).json({text: 'Product with the same name already exists.'})
    else {
        const product = await productSchema.create({
            name,
            description,
            price,
            category,
            tag,
            imageName,
            rating
        })
        if (product)
            res.status(201).json({text: `product with the article number ${product._id} was created`})
        else
            res.status(400).json({text: 'something went wrong when we created a new product.'})
    }
})

// Delete
controller.route('/:articleNumber').delete(async (req, res) => {
    if (!req.params.articleNumber)
        res.status(400).json('no article number was specified')

    const item = await productSchema.findById(req.params.articleNumber)
    if (item) {
        await productSchema.remove(item)
        res.status(200).json({text: `product with article number ${req.params.articleNumber} was deleted`})
    } else {
        res.status(404).json({text: `product with article number ${req.params.articleNumber} was not found`})
    }
})

// PUT
controller.route('/:articleNumber').put(async (req, res) => {
    const { name, description, price, category, tag, imageName, rating } = req.body
    if (!name || !price)
        res.status(400).json({ text: 'Creating a product requires a name and a price' })
    if (!req.params.articleNumber)
        res.status(400).json('An article number is required')
    else {
        const currentProduct = await productSchema.findByIdAndUpdate(req.params.articleNumber, req.body)
        if (currentProduct) {
            res.status(200).json({ text: `The product with article number ${req.params.articleNumber} has been updated` })
        }
        else {
            res.status(404).json({ text: `No product with article number ${req.params.articleNumber} was found` })
        }
    }
})


module.exports = controller
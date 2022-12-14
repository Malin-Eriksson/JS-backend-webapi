const express = require('express')
const { authorize } = require('../middleware/authorization')
const controller = express.Router()


const ProductSchema = require('../schemas/productSchema')


// unsecure routes
controller.route('/').get(async(httpRequest, httpResponse) => {
    const products = []
    const list = await ProductSchema.find()
    if(list) {
        for(let product of list) {
            products.push ({
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
        httpResponse.status(200).json(products)
    } else
        httpResponse.status(400).json()  
})

controller.route('/:tag').get(async(httpRequest, httpResponse) => {
    const products = []
    const list = await ProductSchema.find({ tag: httpRequest.params.tag})
    if(list) {
        for(let product of list) {
            products.push ({
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
        httpResponse.status(200).json(products)
    } else
        httpResponse.status(400).json()  
})

controller.route('/:tag/:take').get(async(httpRequest, httpResponse) => {
    const products = []
    const list = await ProductSchema.find({ tag: httpRequest.params.tag}).limit(httpRequest.params.take)
    if(list) {
        for(let product of list) {
            products.push ({
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
        httpResponse.status(200).json(products)
    } else
        httpResponse.status(400).json()  
})

controller.route('/product/details/:articleNumber').get(async(httpRequest, httpResponse) => {
    const product = await ProductSchema.findById(httpRequest.params.articleNumber)
    if(product) {
        httpResponse.status(200).json({
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
        httpResponse.status(404).json()  
})

// secure routes
    //create
controller.route('/').post(authorize, async(httpRequest, httpResponse) => {
    const { name, description, price, category, tag, imageName, rating } = httpRequest.body

    if (!name || !price)
        httpResponse.status(400).json({text: 'Name and price is required'})
    
    const product_exists = await productSchema.findOne({name})
    if (product_exists)
        httpResponse.status(409).json({text: 'A product with the same name already exists.'})
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
            httpResponse.status(201).json({text: 'Product was created successfully.'})
        else
            httpResponse.status(400).json({text: 'Something went wrong - product could not be created.'})
    }
})

    //update
    // controller.route('/').post(authorize, async(httpRequest, httpResponse) => {
    //     if(!httpRequest.params.articleNumber)
    //         httpResponse.status(400).json({text: 'No article was specified'})
    //     else {
    //         const product = await productSchema.findById (httpRequest.params.articleNumber)
    //         if (product)


    //delete
controller.route('/').delete(authorize, async(httpRequest, httpResponse) => {
    if(!httpRequest.params.articleNumber)
        httpResponse.status(400).json({text: 'No article was specified'})
    else {
        const product = await productSchema.findById (httpRequest.params.articleNumber)
        if (product) {
            await productSchema.remove(product)
            httpResponse.status(200).json({text: `Product with article number ${httpRequest.params.articleNumber} has been deleted.`})
        }
        else {
            httpResponse.status(404).json({text: `Product with article number ${httpRequest.params.articleNumber} was not found.`})
        }
    }
})


module.exports = controller
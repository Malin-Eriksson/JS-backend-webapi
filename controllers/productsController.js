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
controller.route('/create').post(authorize, async(httpRequest, httpResponse) => {
    const { name, description, price, category, tag, imageName, rating } = httpRequest.body

    if (!name || !price)
        httpResponse.status(400).json({text: 'Name and price is required'})
    
    const product_exists = await ProductSchema.findOne({name})
    if (product_exists)
        httpResponse.status(409).json({text: 'A product with the same name already exists.'})
    else {
        const product = await ProductSchema.create({
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
controller.route('/update/:articleNumber').put(async(httpRequest, httpResponse) => {
    if(!httpRequest.params.articleNumber)
        httpResponse.status(400).json({text: 'No article was specified'})
     else {
        const product = await ProductSchema.findById(httpRequest.params.articleNumber, httpRequest.body)
        if (product) {
            await ProductSchema.findByIdAndUpdate(httpRequest.params.articleNumber, httpRequest.body, { new: true })

            if(product)
                httpResponse.status(201).json({text: `Product with articlenumber ${httpRequest.params.articleNumber} was updated`})
            else
                httpResponse.status(400).json({text: `Something went wrong when trying to delete the product`})
        }
        else
            httpResponse.status(404).json({text: `The article ${httpRequest.params.articleNumber} was not found.`})
    }
})   


// controller.route('/:articleNumber').put(async (httpRequest, httpResponse) => {
//     const product = await updatedProduct ({
//         _id: httpRequest.params.articleNumber,
//         name: httpRequest.body.name,
//         description: httpRequest.body.description,
//         price: httpRequest.body.price,
//         category: httpRequest.body.category,
//         tag: httpRequest.body.tag,
//         imageName: httpRequest.body.imageName,
//         rating: httpRequest.body.rating
//     })
//     updatedProduct.updateOne({_id:
//     httpRequest.params.id}, product).then(
//         () => {
//             httpRequest.status(201).json({
//                 text: `Product updated successfully`
//             })
//         }
//     ).catch(
//         (error) => {
//             httpResponse.status(400).json({error: error})
//         }
//     )
// })



// controller.route('/update/:articleNumber').put(async(httpRequest, httpResponse) => {
//         if(!httpRequest.params.articleNumber) {
//         httpResponse.status(400).json({text: 'No article was specified'})
//         }
 
//         console.log(httpRequest.params.articleNumber)
//         console.log(httpRequest.body)

//         const product = await ProductSchema.findByIdAndUpdate(httpRequest.params.articleNumber, httpRequest.body, { new: true })

//         if (!product) {
//             return httpResponse.status(404).json({text: 'could not find that product'})
//         }

//         httpResponse.status(200).json(product)
//     })


//     const {name, price, description, rating, tag, imageName, category} = httpRequest.body

//     try {
//         const filter = httpRequest.body.articleNumber
//         await ProductSchema.findByIdAndUpdate({_id: filter}, {
//             name: name,
//             description: description,
//             price: price,
//             category: category,
//             tag: tag,
//             imageName: imageName,
//             rating: rating
//         }, {new: true})
//         httpResponse.status(200).json()
//     } catch {
//         httpResponse.status(400).json()
//     }

// })

//     if(!httpRequest.params.articleNumber)
//         httpResponse.status(400).json({text: 'No article was specified'})
//     else {  

// controller.route('/:articleNumber').put(async(httpRequest, httpResponse) => {
//     if(!httpRequest.params.articleNumber) {
//     httpResponse.status(400).json({text: 'No article was specified'})
//     }

//     const product = await ProductSchema.findByIdAndUpdate(httpRequest.params.articleNumber, httpRequest.body, { new: true }) {
            
//             if(product) {
//                 httpResponse.status(201).json({text: `Product with articlenumber ${httpRequest.params.articleNumber} was updated`})
//             }
//             else
//                 httpResponse.status(400).json({text: `Something went wrong when trying to update the product`})
//         }
//      }) 
    



    //delete
controller.route('/:articleNumber').delete(authorize, async(httpRequest, httpResponse) => {
    if(!httpRequest.params.articleNumber)
        httpResponse.status(400).json({text: 'No article was specified'})
    else {
        const product = await ProductSchema.findById(httpRequest.params.articleNumber)
        if (product) {
            await ProductSchema.remove(product)
            httpResponse.status(200).json({text: `Product with article number ${httpRequest.params.articleNumber} has been deleted.`})
        }
        else {
            httpResponse.status(404).json({text: `Product with article number ${httpRequest.params.articleNumber} was not found.`})
        }
    }
})


module.exports = controller
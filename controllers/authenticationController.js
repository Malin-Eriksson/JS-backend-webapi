const express = require('express')
const controller = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { generateAccessToken } = require('../middleware/authorization')

const userSchema = require('../schemas/userSchema')


//unsecured routes
controller.route('/signup').post(async(httpRequest, httpResponse)=> {
    const {firstName, lastName, email, password} = httpRequest.body
    if (!firstName || !lastName || !email || !password)
        httpResponse.status(400).json ({text: 'First name, last name, e-mail address and password is required.'})
    
    const userExists = await userSchema.findOne({email})
    if (userExists)
        httpResponse.status(409).json ({text: 'The entered e-mail address is already registered to an existing user account.'})
    else {
        const salt = await bcrypt.genSalt(10) 
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await userSchema.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        if (user) 
            httpResponse.status(201).json ({text: 'User account was successfully created'})
        else 
            httpResponse.status(400).json ({text: 'Something went wrong when trying to create your user account. Please try again later.'})
    }
})

controller.route('/login').post(async(httpRequest, httpResponse)=> {
    const {email, password} = httpRequest.body
    if (!email || !password)
        httpResponse.status(400).json ({text: 'E-mail address and password is required.'})

    const user = await userSchema.findOne({email})
    if (user && await bcrypt.compare(password, user.password)) {
        httpResponse.status(200).json({
            accessToken: generateAccessToken(user._id)
        })
    } else {
        httpResponse.status(400).json ({text: 'Password or e-mail address is incorrect.'})
    } 
})

module.exports = controller
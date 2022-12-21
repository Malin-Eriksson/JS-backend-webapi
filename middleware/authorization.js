const jwt = require('jsonwebtoken')

const generateAccessToken = (id) => {
    return jwt.sign ({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

const authorize = (httpRequest, httpResponse, next) => {
    // console.log(httpRequest.headers)
    if (httpRequest.headers.authorization && httpRequest.headers.authorization.startsWith('Bearer')) {
        try {
            const accessToken = httpRequest.headers.authorization.split(' ')[1]
            const secret = process.env.JWT_SECRET

            const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET)
            next()
        } catch {
            httpResponse.status(401).json()
        } 
    } else {
        httpResponse.status(401).json()
    }
}

module.exports = { generateAccessToken, authorize }
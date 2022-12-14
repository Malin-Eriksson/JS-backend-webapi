const jwt = require('jsonwebtoken')

const generateAccessToken = (id) => {
    return jwt.sign ({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

const authorize = (httpRequest, httpResponse, next) => {
    if (httpRequest.authorization && httpRequest.headers.authorization.startsWith('Bearer')) {
        try {
            const accessToken = httpRequest.headers.authorization.slit(' ')[1]
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
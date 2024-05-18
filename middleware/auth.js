const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const verifyToken = async(req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Token is missing' })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' })
        }

        req.user = user 
        next()
    })
}

module.exports = verifyToken


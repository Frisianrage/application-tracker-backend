const jwt = require('jsonwebtoken')

const generateToken = (id, firstname, email, isAdmin) => {
    return jwt.sign({id, firstname, email, isAdmin}, process.env.JWT_SECRET, {
        expiresIn: '24h'
    })
}

module.exports = generateToken
'use strict';
import jwt from 'jsonwebtoken'

const genericSecure = async (req, res, next) => {
    const headers = req.headers
    req.user = {}
    if (!headers['authorization']) return res.status(401).json({status: 401, message: "User Authorization", data: {}})

    let decoded: any = null
    try {
        // @ts-ignore
        decoded = jwt.verify(headers['authorization'], process.env.SALT_KEY)
        req.user = {
            id: decoded.id,
            address: decoded.address,
            email: decoded.email,
            name: decoded.name
        }
    } catch (err) {
       return res.status(401).json({status: 401, message: "User Authorization", data: {}})
    }
    return next()
}

module.exports = genericSecure

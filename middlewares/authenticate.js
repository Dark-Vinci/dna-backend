const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    let token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({
            status: 401,
            message: 'no auth token was provided'
        })
    } else {
        try {
            const decoded = jwt.verify(token, config.get("signature"));
            req.user = decoded;
            next();
        } catch(err) {
            res.status(403).json({
                status: 403,
                message: 'invalid auth token was provided'
            })
        }
    }
}

module.exports = auth;
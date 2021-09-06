const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    let token = req.header('x-auth-token');
    if (!token) {
       return res.status(401).send('no token provided');
    } else {
        try {
            const decoded = jwt.verify(token, config.get("signature"));
            req.user = decoded;
            next();
        } catch(err) {
            res.status(403).send('invalid token was provided')
        }
    }
}

module.exports = auth;
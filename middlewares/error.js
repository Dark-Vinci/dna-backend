const winston = require('winston');

function forEr(err, req, res, next) { 
    winston.log('error', err.message)

    res.status(500).json({
        status: 500,
        message: 'something went wrong on the server'
    })
}

module.exports = forEr;
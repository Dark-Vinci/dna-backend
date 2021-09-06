const winston = require('winston');

function forEr(err, req, res, next) { 
    winston.log('error', err.message)
    res.status(500).send('something went wrong')
}

module.exports = forEr
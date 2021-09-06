const config = require('config');

function configg() {
    if (!config.get('signature')) {
        throw new Error('fatal error, jwt privatekey (jwt_key) is not defined')
    }
}

module.exports = configg
const Joi = require('joi');

function joi() {
    Joi.objectId = require('joi-objectid');
}

module.exports = joi;
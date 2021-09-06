const mongoose = require('mongoose');
const Joi = require('joi');

const homeSchema = new mongoose.Schema({
    header: {
        type: String,
        minlength: 5,
        maxlength: 15,
        required: true
    },

    message: {
        type: String,
        required: false,
        minlength: 30,
        maxlength: 50
    },

    body1: {
        type: String,
        minlength: 30,
        maxlength: 1000,
        required: true
    },

    body2: {
        type: String,
        minlength: 30,
        maxlength: 1000,
        required: true
    },

    body3: {
        type: String,
        minlength: 30,
        maxlength: 1000,
        required: true
    },

    footer: {
        type: String,
        maxlength: 500,
        minlength: 30,
        required: true
    },

    isFinished: {
        type: Boolean,
        default: false,
        required: true
    },

    dateCreated: {
        type: Date,
        default: Date.now
    }
});

const Home = mongoose.model('Home', homeSchema);

function validate(inp) {
    const schema = Joi.object({
        isFinished: Joi.boolean()
            .required(),

        footer : Joi.string()
            .required()
            .min(30)
            .max(500),

        body3: Joi.string()
            .min(30)
            .max(1000),

        body2: Joi.string()
            .required()
            .min(30)
            .max(1000),
        body1: Joi.string()
            .min(30)
            .max(1000)
            .required(),
        message: Joi.string()
            .min(30)
            .max(50),
        header: Joi.string()
            .min(5)
            .max(20)
            .required()
    });

    const result = schema.validate(inp);
    return result;
}

function validatePut(inp) {
    const schema = Joi.object({
        isFinished: Joi.boolean(),

        footer : Joi.string()
            .min(30)
            .max(500),

        body3: Joi.string()
            .min(30)
            .max(1000),

        body2: Joi.string()
            .min(30)
            .max(1000),

        body1: Joi.string()
            .min(30)
            .max(1000),

        message: Joi.string()
            .min(30)
            .max(50),

        header: Joi.string()
            .min(5)
            .max(20)
    });

    const result = schema.validate(inp);
    return result;
}

module.exports = {
    Home,
    validate,
    validatePut
}
const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const { testSchema } = require('./dna');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
        lowercase: true
    },

    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
        lowercase: true
    },

    sex: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },

    email: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 100,
        unique: true
    },

    phoneNumber: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 20
    },

    testType: {
        type: [ testSchema ]
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 2000
    },

    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    },

    isAdmin : {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('signature'))
}

const User = mongoose.model('User', userSchema);

function validate(inp) {
    schema = Joi.object({
        firstName: Joi.string().required().min(2).max(200),
        lastName: Joi.string().required().min(2).max(200),
        sex: Joi.string().required().min(4).max(6),
        age: Joi.number().integer().min(18).max(100).required(),
        email: Joi.string().email().required(),
        password:Joi.string().required().min(6),
        address: Joi.string().required().min(5).max(100),
        phoneNumber: Joi.string().required().min(4).max(20)
    });

    const result = schema.validate(inp);
    return result;
}

function validatePut(inp) {
    schema = Joi.object({
        firstName: Joi.string().min(2).max(200),
        lastName: Joi.string().min(2).max(200),
        sex: Joi.string().min(4).max(6),
        age: Joi.number().integer().min(18).max(100),
        email: Joi.string().email(),
        password:Joi.string().min(6),
        address: Joi.string().min(5).max(100),
        phoneNumber: Joi.string().min(4).max(20)
    });

    const result = schema.validate(inp);
    return result;
}

function validatePassword(inp) {
    const schema = Joi.object({
        oldPassword: Joi.string().required().min(7),
        newPassword: Joi.string().required().min(7)
    })

    const result = schema.validate(inp);
    return result;
}

function validateIn(inp) {
    schema = Joi.object({
        email: Joi.string().email().required(),
        password:Joi.string().required().min(6)
    })

    const result = schema.validate();
    return result;
}

module.exports.User = User;
module.exports.validate = validate;
module.exports.validateIn = validateIn;
module.exports.validatePut = validatePut;
module.exports.validatePassword = validatePassword;
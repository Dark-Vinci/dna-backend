const Joi = require('joi');
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    nameOfPresumedSibling: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15
    },

    dateOfRequest: {
        type: Date,
        default: Date.now
    },

    presumedRelation: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15
    },

    testResult: {
        type: String,
        enum: ['undecided', 'positive', 'negative'],
        default: 'undecided'
    },

    requestedKit: {
        type: Boolean,
        default: false
    },

    kitSent: {
        type: Boolean,
        default: false
    },

    kitRecieved: {
        type: Boolean,
        default: false
    }
});

const Test = mongoose.model('Test', testSchema);

function validate(input) {
    const schema = Joi.object({
        presumedRelation: Joi.string()
            .required()
            .min(3)
            .max(15),

        nameOfPresumedSibling: Joi.string()
            .required()
            .min(3)
            .max(15)
    });

    const result = schema.validate(input);
    return result;
}

function val(input) {
    const schema = Joi.object({
        kitRecieved: Joi.boolean(),

        kitSent: Joi.boolean(),

        requestedKit: Joi.boolean(),

        testResult: Joi.string()
            .min(4)
            .max(7)
    })

    const result = schema.validate(input);
    return result;
}

module.exports = {
    val,
    Test,
    testSchema,
    validate
}
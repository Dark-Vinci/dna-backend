const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');

const router = express.Router();

const { validate, User } = require('../models/userM');

const wrapper = require('../middlewares/wrap');
const bodyValidator = require('../middlewares/bodyValidator');

router.post('/', bodyValidator(validate), wrapper ( async (req, res) => {
    let { email, password, firstName, lastName, sex, phoneNumber, address } = req.body;

    const isRegistered = await User.findOne({ email: email});

    if (isRegistered) {
        return res.status(400).json({
            status: 400,
            message: 'a user with same email has once been registered'
        })
    } else {
        let salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        const user = new User({
            address,password,
            phoneNumber, email,
            firstName, lastName, sex,
        });
        await user.save();

        const token = user.generateToken();
        const toReturn  = _.pick(user, ['firstName', 'lastName', 'email', 'password']);

        res.header('x-auth-token', token).status(200).json({
            status: 201,
            message: 'success',
            data: toReturn
        })
    }
}))

module.exports = router
const express = require('express');
const router = express.Router();
const { validate, User } = require('../models/userM');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const wrapperMiddleware = require('../middlewares/wrap');

router.post('/', wrapperMiddleware(async (req, res) => {
    const { error } = validate(req.body);

    if (error) {
       return res.status(400).send(error.details[0].message)
    } else {
        let { email, password, firstName, lastName, sex, phoneNumber, address } = req.body;
        const check = await User.findOne({ email: email});
        if (check) {
            return res.status(400).send('a user with same email has once been registered');
        } else {
            let salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            const user = new User({
                firstName,
                lastName,
                sex,
                phoneNumber,
                email,
                address,
                password
            })
            await user.save();
            const token = user.generateToken();
            const result  = _.pick(user, ['firstName', 'lastName', 'email', 'password']);
            res.header('x-auth-token', token).send(result);
        }
    }
}))

module.exports = router
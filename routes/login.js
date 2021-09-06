const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const { User, validateIn } = require('../models/userM');

const wrapper = require('../middlewares/wrap');
const bodyValidator = require('../middlewares/bodyValidator');

router.post('/', bodyValidator(validateIn), wrapper ( async ( req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email: email });

    if (!user) {
        return res.status(400).json({
            status: 400,
            message: 'invalid username or password...'
        })
    } else {
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(400).json({
                status: 400,
                message: 'invalid username or password...'
            });
        } else {
            const token = user.generateToken();

            res.header('x-auth-token', token).status(200).json({
                status: 200,
                message: 'success',
                data: user
            })
        }
    }
}));

module.exports = router;
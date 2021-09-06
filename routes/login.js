const { User, validateIn } = require('../models/userM');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const wrapperMiddleware = require('../middlewares/wrap');

router.post('/', wrapperMiddleware(async ( req, res) => {
    const { error } = validateIn(req.body);
    const { email, password } = req.body;

    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send('invalid username or password...');
        } else {
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                return res.status(400).send('invalid username or password...');
            } else {
                const token = user.generateToken();
                res.header('x-auth-token', token).send('welcome home....')
            }
        }
    }
}));

module.exports = router;
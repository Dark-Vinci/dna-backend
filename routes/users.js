const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');

const router = express.Router();

const wrapper = require('../middlewares/wrap');
const admin = require('../middlewares/isAdmin');
const auth = require('../middlewares/authenticate');
const idValidator = require('../middlewares/idValidator');
const bodyValidator = require('../middlewares/bodyValidator');

const { User, validatePut, validatePassword } = require('../models/userM');

const adminMiddleware = [ auth, admin ];
const idAuthMiddleware = [ idValidator, auth ];
const idAdminMiddleware = [ idValidator, auth, admin ];
const editMiddleware = [ auth, idValidator, bodyValidator(validatePut) ];
const changePasswordMiddleware = [ auth, idValidator, bodyValidator(validatePassword) ];

router.get('/all',  adminMiddleware, wrapper ( async (req, res) => {
    const users = await User.find()
        .select({ password: 0 });

    res.status(200).json({
        status: 200,
        message: 'success',
        data: users
    })
}));

router.put('/changepassword', changePasswordMiddleware, wrapper ( async (req, res) => {
    const id = req.user._id;

    const { newPassword, oldPassword } = req.body;

    const user = await User.findById(id);

    const isValid = await bcrypt.compare(oldPassword, user.password);

    if (!isValid) {
        return res.status(400).json({
            status: 400,
            message: 'invalid input'
        })
    } else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        user.password = hash;
        await user.save();

        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'password successfuly changed'
        })
    }
}));

router.get('/me-data', idAuthMiddleware, wrapper ( async (req, res) => {
    const id = req.user._id;

    const user = await User.findById(id)
        .select({ password: 0 });

    if (!user) {
        return res.status(400).json({
            status: 400,
            message: 'be like sey you dey ment, send better id'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: user
        })
    }
}));

router.put('/edit', editMiddleware, wrapper ( async (req, res) => {
    const id = req.user._id;
    let user = await User.findById(id);

    if (!user){
        return res.status(400).json({
            status: 400,
            message: 'ment dey do you man'
        })
    } else {
        const { firstName, lastName, phoneNumber, address } = req.body;

        user.set({
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            phoneNumber: phoneNumber || user.phoneNumber,
            address: address || user.address
        })

        await user.save();

        toReturn = _.pick(result, ['firstName', 'lastName', 'age', 'sex', 'phoneNumber', 'email', 'address'])

        res.status(200).json({
            status: 200,
            message: 'success',
            data: toReturn
        })
    }
}));

router.delete('/remove/:id', idAdminMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const user = await User.findOneAndRemove({ _id: id });

    if (!user) {
        return res.status(404).json({
            status: 404,
            message: 'user not found'
        })
    } else {
        const result = _.pick(user, ['firstName', 'lastName', 'phoneNumber', 'email']);

        res.status(200).json({
            status: 200,
            message: 'success',
            data: result
        })
    }
}));

router.get('/get-user/:id', idAdminMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({
            status: 404,
            message: 'user not found'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: user
        })
    }
}));

module.exports = router;
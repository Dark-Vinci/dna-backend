const express = require('express');
const { validate, User, validatePut, validatePassword } = require('../models/userM');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const { Test } = require('../models/dna');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/authenticate');
const admin = require('../middlewares/isAdmin');
const wrapperMiddleware = require('../middlewares/wrap');

const val = mongoose.Types.ObjectId

router.get('/', [ auth, admin ], wrapperMiddleware(async (req, res) => {
    const users = await User
        .find()
        .select('-password');
    res.send(users);
}));

router.put('/:id/changepassword', [ auth ], wrapperMiddleware(async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;

    if (!val.isValid(id)) {
        return res.status(404).send('you might be lost boss man');
    } else {
        if (id === userId) {
            const { error } = validatePassword(req.body);
            if (error) {
                return res.status(400).send(error.details[0].message)
            } else {
                const { newPassword, oldPassword } = req.body;
                const user = await User.findById(id);
                const isValid = await bcrypt.compare(oldPassword, user.password);
                if (!isValid) {
                    return res.status(400).send('invalid input');
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(newPassword, salt);
                    user.password = hash;
                    await user.save();
                    res.send('password successfuly changed');
                }
            }
        } else {
            return res.status(404).send('you broke something');
        }
    }
}));

router.get('/:id', [ auth ], wrapperMiddleware(async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;

    if (id === userId || req.user.isAdmin) {
        if (!val.isValid(id)) {
            return res.status(400).send('ment lord...');
        } else {
            const user = await User
            .findById(id)
                .select('-password');
            if (!user) {
                return res.status(400).send('be like sey you dey ment, send better id')
            } else {
                res.send(user)
            }
        }
    } else {
        res.status(400).send('you broke something...')
    }
}));

router.put('/:id',[ auth ], wrapperMiddleware(async (req, res) => {
   const { error } = validatePut(req.body);
   const { id } = req.params;
   const customerId = req.user._id;

    if (id === customerId || req.user.isAdmin) {
        if (!val.isValid(id)) {
            return res.status(400).send('ment lord...')
        } else {
            if (error) {
                return res.status(400).send(error.details[0].message)
            } else {
                let user = await User
                    .findById(id);
                if (!user){
                    return res.status(400).send('ment dey do you man')
                } else {
                    let obj = Object.keys(req.body);
    
                    if (obj.includes('password')) {
                        return res.status(400).send('this is not the right place to change a password');
                    } else {
                        for (let i of obj) {
                            user[i] = req.body[i];
                        }
            
                        let result = await user.save();
                        result = _.pick(result, ['firstName', 'lastName', 'age', 'sex', 'phoneNumber', 'email', 'address'])
                        res.send(result);
                    }
                }
            }
        }
    } else {
        return res.status(400).send('you broke something..')
    }
}))

router.delete('/:id',[ auth, admin ], wrapperMiddleware(async (req, res) => {
    const { id } = req.params;
    if (!val.isValid(id)) {
        res.status(400).send('you dey ment bro...')
    } else {
        const user = await User
            .findOneAndRemove({ _id: id });
        if (!user) {
            return res.status(400).send('ment whahala');
        } else {
            const result = _.pick(user, ['firstName', 'lastName', 'phoneNumber', 'email'])
            res.send(user);
        }
    }
}))

router.get('/:id/profile',[ auth ], wrapperMiddleware(async (req, res) => {
    const { id } = req.params;
    const customerId = req.user._id;

    if (id === customerId || req.user.isAdmin) {
        if (!val.isValid(id)) {
            return res.status(404).send('youre a lost man, sadly...');
        } else {
            let userTest;
            const tests = await Test
                            .find();
            for (let j of tests) {
                if (test.user === id) {
                    userTest = j;
                    break;
                }
            }
            if (!userTest) {
                return res.send('you havent started any test procedures...');
            } else {
                res.send(userTest)
            }
        }
    }
}));

router.post('/', wrapperMiddleware(async (req, res) => {
    const { error } = validate(req.body);

    if (error) {
       return res.status(400).send(error.details[0].message)
    } else {
        let { email, password, firstName, lastName, sex, phoneNumber, testType, address } = req.body;
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
            const result  = _.pick(user, ['firstName', 'lastName', 'email']);
            res.header('x-auth-token', token).send(result);
        }
    }
}));

module.exports = router;
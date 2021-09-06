const express = require('express');

const router = express.Router();

const { User } = require('../models/userM');
const auth = require('../middlewares/authenticate');
const admin = require('../middlewares/isAdmin');
const wrapper = require('../middlewares/wrap');

const { validate, Test, val } = require('../models/dna');

const idAdminMiddleware = [ auth, admin, idValidator ];
const createMiddleware = [ auth, bodyValidator(validate) ];
const editMiddleware = [ idValidator, bodyValidator(val), auth, admin ];


router.post('/create', createMiddleware, wrapper ( async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id);

    const { presumedRelation, nameOfPresumedSibling } = req.body;

    const test = new Test({
        userId: _id,
        presumedRelation,
        nameOfPresumedSibling
    })

    await test.save();

    user.testType.push(test);
    await user.save();

    res.status(201).json({
        status: 201,
        message: 'success',
        data: test
    })
}));

router.get('/get-all', [auth, admin], wrapper ( async (req, res) => {
    const tests = await Test.find();

    res.status(200).json({
        status: 200,
        message: 'success',
        data: tests
    });
}));

router.delete('/remove/:testId', idAdminMiddleware, wrapper ( async (req, res) => {
    const id = req.body.testId;

    const test = await Test.findOneAndRemove({ _id: id });

    if (!test) {
        return res.status(400).json({
            status: 400,
            message: 'no such test in the database'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: test
        })
    }
}));

router.put('/edit/:testId', editMiddleware, wrapper ( async (req, res) => {
    const id = req.params.testId;

    const { kitRecieved, kitSent, requestedKit, testResult } = req.body;

    let test = await Test.findById(id);

    if (!test) {
        return res.status(400).json({
            state: 400,
            message: 'no such test in the database'
        })
    } else {
        test.set({
            kitSent: kitSent || test.kitSent,
            kitRecieved: kitRecieved || test.kitRecieved,
            requestedKit: requestedKit || test.requestedKit,
            testResult: test.testResult || home.testResult
        });

        await test.save();

        res.status(200).json({
            state: 200,
            message: 'success',
            data: test
        })
    }
}));

module.exports = router;
const express = require('express');
const { validate, Test, val, validatePut } = require('../models/dna');
const { User } = require('../models/userM');
const auth = require('../middlewares/authenticate');
const isAdmin = require('../middlewares/isAdmin');
const mongoose = require('mongoose');
const wrapperMiddleware = require('../middlewares/wrap');

const router = express.Router();

router.post('/', auth, wrapperMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    const { _id } = req.user;
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const { presumedRelation, nameOfPresumedSibling } = req.body;

        const test = new Test({
            userId: _id,
            presumedRelation,
            nameOfPresumedSibling
        })

        await test.save();
        const user = await User.findById(_id);
        user.testType.push(test);
        await user.save();
        res.send(test);
    }
}));

router.get('/',[auth, isAdmin], wrapperMiddleware(async (req, res) => {
    const tests = await Test
        .find();
    res.send(tests)
}));

router.get('/filter', [auth, isAdmin], wrapperMiddleware(async (req, res) => {
    const filters = [ 'testResult','requestedKit', 'kitSent',  'kitRecived'];
    
    const filter = req.body.filter;
    if (!filters.includes(filter)) {
        return res.status(400).send('invalid search inputs...');
    } else {
        const query = {};
        for (let j in req.body) {
            query[j] = req.body[j];
        }
        const tests = await Test.find(query)
        res.send(tests)
    }
}));

router.delete('/:testId', [auth, isAdmin], wrapperMiddleware(async (req, res) => {
    const id = req.body.testId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send('we can see that youre very lost boss')
    } else {
        const test = await Test.findOneAndRemove({ _id: id });
        if (!test) {
            res.status(400).send('no such test in the database');
        } else {
            res.send(test);
        }
    }
}));

router.put('/:testId', [auth, isAdmin], wrapperMiddleware(async (req, res) => {
    const { error } = val(req.body);
    const id = req.params.testId;

    if (error) {
        return res.status(400).send(error.details[0].message); 
    } else {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send('we dont play here bitch');
        } else {
            let obj = Object.keys(req.body);
            let test = await Test.findById(id);
    
            if (!test) {
                return res.status(400).send('no such test in the database')
            }
            
            for (let i of obj) {
                test[i] = req.body[i]
            }
    
            await test.save();
            res.send(test)
        }
    }
}));

module.exports = router;
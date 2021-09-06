const express = require('express');
const router = express.Router();
const { Home, validateInp, validate, validatePut } = require('../models/homeM');
const mongoose = require('mongoose');

const val = mongoose.Types.ObjectId;

router.get('/', async (req, res) => {
    const homes = await Home
        .find();
    let latestHome;

    if (homes.length > 0) {
        for (let i = homes.length - 1; i >= 0; i--) {
            if (homes[i].isFinished === true) {
                latestHome = homes[i];
                break;
            }
        }

        if (!latestHome) {
            return res.send('there are nothing to show on our home page currently')
        } else {
            res.send(latestHome)
        }
    } else {
        res.send('this is the home page')
    }
});

router.get('/getAllHome', async (req, res) => {
    const homes = await Home.find();
    res.send(homes)
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!val.isValid(id)) {
        return res.status(400).send("you're now officially the ment lord")
    } else {
        const home = await Home.findById(id);
        if (!home) {
            return res.status(400).send('no such home the the database...');
        } else {
            res.send(home)
        }
    }
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    } else {
        const { isFinished, footer, body3, body2, body1, message, header } = req.body;
        const home = new Home({
            header,
            message,
            body1,
            body2,
            body3,
            footer,
            isFinished
        });
        const result = await home.save();
        res.send(result)
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    if (!val.isValid(id)) {
        return res.status(400).send('your id no correct..');
    } else {
        const { error } = validatePut(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const home = await Home.findById(id);
            if (home.isFinished === true) {
                return res.status(400).send('cant be modified..')
            } else {
                const obj = Object.keys(req.body);

                for (let k of obj) {
                    home[k] = req.body[k];
                }

                await home.save();
                res.send(home);
            }
        }
    }
})

module.exports = router;
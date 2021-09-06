const express = require('express');

const router = express.Router();

const auth = require('../middlewares/authenticate');
const admin = require('../middlewares/isAdmin');
const wrapper = require('../middlewares/wrap');
const idValidator = require('../middlewares/idValidator');
const bodyValidator = require('../middlewares/bodyValidator');

const idAdminMiddleware = [ idValidator, auth, admin ];
const createMiddleware = [ auth, admin, bodyValidator(validate) ];
const editMiddleware = [ idValidator, bodyValidator(validatePut), auth, admin ];

const { Home, validateInp, validate, validatePut } = require('../models/homeM');

router.get('/', wrapper ( async (req, res) => {
    const homes = await Home
        .find({ isFinished: true })
        .sort({ dateCreated: -1 })

    if (homes.length <= 0) {
        res.status(200).json({
            status: 200,
            message: 'welcome home boy'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: homes[0]
        })
    }
}));

router.get('/getAllHome',[ auth, admin ], wrapper ( async (req, res) => {
    const homes = await Home.find();

    res.status(200).json({
        status: 200,
        message: 'success',
        data: homes
    })
}));

router.get('/one/:id', idAdminMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const home = await Home.findById(id);

    if (!home) {
        return res.status(400).json({
            status: 400,
            message: 'no such home the the database...'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: home
        })
    }
}));

router.post('/create', createMiddleware, wrapper ( async (req, res) => {
    const { isFinished, footer, body3, body2, body1, message, header } = req.body;

    const home = new Home({
        header, message, body1,
        body2, body3, footer, isFinished
    });

    await home.save();

    res.status(201).json({
        status: 201,
        message: 'success', 
        data: home
    });
}));

router.put('/edit/:id', editMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const home = await Home.findById(id);

    if (home.isFinished === true) {
        return res.status(400).json({
            status: 400,
            message: 'published home document cant be modified'
        })
    } else {
        const { isFinished, footer, body3, body2, body1, message, header } = req.body;

        home.set({
            isFinished: isFinished || home.isFinished,
            footer: footer || home.footer,
            body1: body1 || home.body1,
            body2: body2 || home.body2,
            body3: body3 || home.body3,
            message: message || home.message,
            header: header || home.header
        })

        await home.save();
        
        res.status(200).json({
            status: 200,
            message: 'success',
            data: home
        })
    }
}));

module.exports = router;
const express = require('express');
const helmet = require('helmet');
const register = require('../routes/register');
const users = require('../routes/users')
const login = require('../routes/login');
const tests = require('../routes/testing');
const home = require('../routes/home');
const erro = require('../middlewares/error');
const morgan = require('morgan');

function routes(app) {
    if (app.get('env') == 'development') {
        app.use(morgan('tiny'))
    }
    
    app.use(helmet())
    app.use(express.urlencoded({ extended: true}));
    app.use(express.json());
    
    app.use('/', home);
    app.use('/api/register', register);
    app.use('/api/users', users);
    app.use('/api/login', login);
    app.use('/api/tests', tests);

    app.use(erro);
}

module.exports = routes
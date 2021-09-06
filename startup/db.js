const mongoose = require('mongoose');
const winston = require('winston');

function db() {
    mongoose.connect('mongodb://localhost/healthy', {
        useNewUrlParser: true,
        useCreateIndex: true })
    .then(() => winston.log('info', 'connected to the database'))
}

module.exports = db;
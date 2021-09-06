function appMan(app) {
    require('./startup/validate')();
    require('./startup/error')(app);
    require('./startup/routes')(app);
    require('./startup/db')();
    require('./startup/config')();
}

module.exports = appMan;
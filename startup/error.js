const winston = require('winston');
require('winston-mongodb');

function logging(app) {
    winston.add(new winston.transports.File( { filename: 'loglj.log'}));
    winston.add(new winston.transports.MongoDB( { 
        db: 'mongodb://localhost/healthy',
        level: 'info'
    }));

    if (app.get('env') == 'development') {
        winston.add(new winston.transports.Console( { 
            format: winston.format.simple(),
            colorize: true,
            prettyPrint: true
        }));
    }

    process.on('uncaughtException', (ex) => {
        console.log('uncaught expeion')
        winston.log('error', ex.message);
        process.exit(1);
    });
    
    process.on('unhandledRejection', (ex) => {
        throw ex.message
    })
}

module.exports = logging;
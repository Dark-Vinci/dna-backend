const express = require('express');
const winston = require('winston');
const app = express();

require('./appMan')(app);

const port = process.env.PORT || 2000;
app.listen(port, () => winston.info(`listening at port ${ port }`));
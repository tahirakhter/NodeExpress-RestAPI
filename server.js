'use strict';
const app = require('./app/routes');
const mongoose = require('mongoose');
const helmet = require('helmet');

require('dotenv').config();

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
  useCreateIndex: true,
  useNewUrlParser: true
});

// for XSS
app.use(helmet());

// set port for server to listen
app.listen(process.env.PORT, () => {
  console.log('server started on port ' + process.env.PORT);
});


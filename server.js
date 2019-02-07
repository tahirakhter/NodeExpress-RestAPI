// load node modules
const app = require('./app/routes');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL);

//for allowing cross origin requests
app.use(cors());

//set port for server to listen
app.listen( process.env.PORT, () => {
    console.log('server started on port ' +  process.env.PORT);
})


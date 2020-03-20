require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

const mongoose = require('mongoose');

mongoose.connect('mongodb://ashwath:ashwath123@ds235711.mlab.com:35711/heroku_7qm1whwr', { 
    useNewUrlParser: true, dbName: "heroku_7qm1whwr" }, (err) => {
        if (!err) {
            console.log('Successfully Established Connection with MongoDB')
        }
        else {
            console.log('Failed to Establish Connection with MongoDB with Error: ' + err)
        }
});

// api routes
app.use('/slots', require('./slots/slots.controller'));
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? 443 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

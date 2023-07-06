const express = require('express');
const morgan = require('morgan');
const route = require('./routes');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser('secret'));
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);
app.use(flash());

// FILE MANAGEMENT
app.use('/media', express.static('media'));
//app.use('/uploads', express.static());

app.use(route);
module.exports = app;
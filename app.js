require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');

const logger = require('morgan');
const hbs = require('hbs');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const flash = require('connect-flash');

//1. Databse configuration
const mongoose = require('mongoose');

mongoose
	.connect('mongodb+srv://jaimejacobo:1234@cluster0.iuw7p.mongodb.net/oscar_prueba?retryWrites=true&w=majority', {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then((connection) => {
		console.log('Connected to Mongo!');
	})
	.catch((err) => {
		console.log('error connecting to Mongo: ', err);
	});

const app = express();

//2. Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

//3. Cors middleware

app.use(
	cors({
		credentials: true,
		origin: [ 'http://localhost:3001' ]
	})
);

//4. Session configuration

app.use(
	session({
		secret: 'oscar_prueba',
		resave: true,
		saveUninitialized: true
	})
);

//5. Passport configuration
require('./config/passportConfig');

//6. Middleware passport
app.use(passport.initialize());
app.use(passport.session());

//7. Routes
const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth-routes');
app.use('/', authRoutes);

module.exports = app;

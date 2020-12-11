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
const flash = require('connect-flash')

//1. Databse configuration
const mongoose = require('mongoose');

mongoose
	.connect(`mongodb+srv://jaimejacobo:1234@cluster0.iuw7p.mongodb.net/prueba_2?retryWrites=true&w=majority`, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then((x) => {
		console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
	})
	.catch((err) => {
		console.error('Error connecting to mongo', err);
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
		origin: [ 'https://mangas-kawaii.netlify.app' ]
	})
);

//4. Session configuration

app.use(
	session({
		secret: 'prueba_2',
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

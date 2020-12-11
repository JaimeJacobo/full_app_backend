require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const hbs = require('hbs');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

require('./config/passportConfig');



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

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.enable('trust proxy'); // add this line

// app.use(()=>'Set-Cookie: cross-site-cookie=name; SameSite=None; Secure')

// app.use(require('node-sass-middleware')({
//   src:  path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   sourceMap: true
// }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(
	session({
		secret: 'our-passport-local-strategy-app',
		resave: true,
		saveUninitialized: true,
		proxy: true
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use(
	cors({
		credentials: true,
		origin: [ 'http://localhost:3001' ]
	})
);

app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth-routes');
app.use('/', authRoutes);

// app.use((req, res, next) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

module.exports = app;

require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const cors          = require("cors");

const User = require('./models/User')

mongoose
	.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.iuw7p.mongodb.net/full_app?retryWrites=true&w=majority`, {
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

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Middleware de Session
app.use(session({ secret: 'ourPassword', resave: true, saveUninitialized: true }));

//Middleware de passport
app.use(passport.initialize());
app.use(passport.session());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "https://mangas-kawaii.netlify.app");
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(cors({
  credentials: true,
  origin: ["mangas-kawaii.netlify.app"]
}));


app.use((req, res, next)=>{
  res.locals.user = req.user;
  next();
})


app.use(
	require('node-sass-middleware')({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		sourceMap: true
	})
);


//Middleware para serializar al usuario
passport.serializeUser((user, callback) => {
	callback(null, user._id);
});

//Middleware para des-serializar al usuario
passport.deserializeUser((id, callback) => {
	User.findById(id).then((user) => callback(null, user)).catch((err) => callback(err));
});

//Middleware del Strategy
passport.use(
	new LocalStrategy((username, password, next) => {
		User.findOne({ username })
			.then((user) => {
				if (!user) {
					return next(null, false, { message: 'Incorrect username' });
				}

				if (!bcrypt.compareSync(password, user.password)) {
					return next(null, false, { message: 'Incorrect password' });
				}

				return next(null, user);
			})
			.catch((err) => next(err));
	})
);





// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth-routes');
app.use('/', authRoutes);

module.exports = app;

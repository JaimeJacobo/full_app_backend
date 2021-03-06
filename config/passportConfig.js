const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

passport.serializeUser((user, cb) => {
	cb(null, user._id);
});

passport.deserializeUser((id, callback) => {
	User.findById(id)
		.then((user) => {
			callback(null, user);
		})
		.catch((err) => callback(err));
});

passport.use(
	new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
		User.findOne({ username }, (err, user) => {
			if (err) {
				return next(err);
			}
			if (!user) {
				return next(null, false, { message: 'Incorrect username' });
			}
			if (!bcrypt.compareSync(password, user.password)) {
				return next(null, false, { message: 'Incorrect password' });
			}
			return next(null, user);
		});
	})
);

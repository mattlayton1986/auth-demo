const express 							= require('express'),
			mongoose 							= require('mongoose'),
			passport 							= require('passport'),
			bodyParser 						= require('body-parser'),
			expressSession				= require('express-session'),
			LocalStrategy 				= require('passport-local'),
			passportLocalMongoose = require ('passport-local-mongoose'),

			User									= require('./models/user');

mongoose.connect( 'mongodb://localhost/auth_demo' );

const app = express();

app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());
app.use(expressSession({
	secret: 'Web Developer Bootcamp is awesome',
	resave: false,
	saveUninitialized: false
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', ( req, res ) => {
	res.render('home');
});

app.get('/secret', ( req, res ) => {
	res.render('secret');
});

app.listen(3000, () => {
	console.log('auth-app server is running on port 3000');
})
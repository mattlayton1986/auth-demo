const express 							= require('express'),
			mongoose 							= require('mongoose'),
			passport 							= require('passport'),
			bodyParser 						= require('body-parser'),
			expressSession				= require('express-session'),
			LocalStrategy 				= require('passport-local'),
			passportLocalMongoose = require ('passport-local-mongoose'),

			User									= require('./models/user');

// =========================
//	INITIALIZATION
// =========================

mongoose.connect( 'mongodb://localhost/auth_demo' );

const app = express();

app.set('view engine', 'ejs');

app.use(expressSession({
	secret: 'Web Developer Bootcamp is awesome',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =========================
//	ROUTES
// =========================

app.get('/', ( req, res ) => {
	res.render('home');
});

app.get('/secret', isLoggedIn, ( req, res ) => {
	res.render('secret');
});

// Auth Routes
app.get('/register', ( req, res ) => {
	res.render('register');
});

app.post('/register', ( req, res ) => {
	User.register(new User( {username: req.body.username}),
						req.body.password,
						(err, user) => {
							if (err) {
								console.log(err);
								res.render('register');
							}
								passport.authenticate('local')(req, res, () => {
									res.redirect('/secret');
								});
								// passport.authenticate('local', (req, res) => {
								// 	res.redirect('/secret');
								// });
						});
});

app.get('/login', ( req, res ) => {
	res.render('login');
});

app.post('/login',
					passport.authenticate('local', {
						successRedirect: '/secret',
						failureRedirect: '/login'
					}),
 					( req, res ) => {}
 );

app.get('/logout', ( req, res ) => {
	req.logout();
	res.redirect('/');
});

function isLoggedIn( req, res, next ) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};

// =========================
//	SERVER
// =========================

app.listen(3000, () => {
	console.log('auth-app server is running on port 3000');
})
// Require express
var express = require('express');
// Set up express
var app = express();
// Require mongostore session storage
var mongoStore = require('connect-mongo')(express);
var passport = require('passport');
// Require needed files
var database = require('./admin/data');
var config = require('./shop/config.json');
var info = require('./package.json');

console.log('NodeShop Admin Started!');

// Connect to database
database.startup(config.connection);
console.log('Connecting to database...');

app.set('port', process.env.PORT || 3000);
// Configure Express
app.configure(function(){

    // Set up jade
    app.set('views', __dirname + '/admin/views');
    app.set('view engine', 'jade');

    app.use(express.favicon());
    app.use(express.cookieParser());
    app.use(express.bodyParser());

    // Set up sessions
    app.use(express.session({
        // Set up MongoDB session storage
        store: new mongoStore({url:config.connection}),
        // Set session to expire after 21 days
        cookie: { maxAge: new Date(Date.now() + 181440000)},
        // Get session secret from config file
        secret: config.cookie_secret
        }));

    // Set up passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Define public assets
    app.use(express.static(__dirname + '/admin/public'));

});

// Require router, passing passport for authenticating pages
require('./admin/router')(app, passport);

// Listen for requests
app.listen(app.get('port'));

console.log('NodeShop v' + info.version + ' Admin Area listening on port ' + process.env.PORT);

// Handle all uncaught errors
process.on('uncaughtException', function(err) {
    console.log(err);
});
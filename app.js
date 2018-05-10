/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');

const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const adminController = require('./controllers/admin');
const postController = require('./controllers/post');
const userController = require('./controllers/user');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');



/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 86400000 }, // 1 day in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
    mongooseConnection: mongoose.connection
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== '/' &&   
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.originalUrl;
  } else if (req.user &&
    req.path === '/home') {
    req.session.returnTo = req.originalUrl;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/home', passportConfig.isAuthenticated, homeController.index);
app.get('/', adminController.getLogin);
app.post('/', adminController.postLogin);
app.get('/logout', adminController.logout);
app.get('/account', passportConfig.isAuthenticated, adminController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, adminController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, adminController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, adminController.postDeleteAccount);

/**
 * App related routes
 **/

app.get('/categories', passportConfig.isAuthenticated, postController.getCategories);
app.post('/category/delete/:id', passportConfig.isAuthenticated, postController.deleteCategory);

 app.get('/posts', passportConfig.isAuthenticated, postController.getPosts);
 app.get('/post/:id', passportConfig.isAuthenticated, postController.getPost);
 app.get('/posts/search/:query', passportConfig.isAuthenticated, postController.getPostsSearch);
 app.get('/posts/:page', passportConfig.isAuthenticated, postController.getPostsByPage);
 app.post('/post/delete/:id', passportConfig.isAuthenticated, postController.deletePost);


 app.get('/users', passportConfig.isAuthenticated, userController.getUsers);
 app.get('/users/:page', passportConfig.isAuthenticated, userController.getUsersByPage);
 app.get('/users/search/:query', passportConfig.isAuthenticated, userController.getUsersSearch);
 app.post('/user/delete/:id', passportConfig.isAuthenticated, userController.deleteUser);

/**
 * Analytics and chart related routes
 **/
 app.get('/postsbymonth', homeController.postsbymonth);


/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(process.env.PORT || 3000, () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;

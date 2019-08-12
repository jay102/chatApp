const express = require('express');
const debug = require('debug')('app');
const chalk = require('chalk').green;
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const db = require('./database/config');
const app = express();
const server = require('http').Server(app);
const io = module.exports.io = require('socket.io')(server);
const socketManager = require('./src/sockets/socketManager');

//declare port
const port = process.env.PORT || 5000;

//test db
db.authenticate()
    .then(() => debug("Database Connected Successfully"))
    .catch(err => debug("Error :" + err));


//import routes
const Auth = require('./src/routes/Auth/auth');
const Home = require('./src/routes/Home/home')();


//Middlewares
app.use(morgan('tiny'));

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Express Sessions
app.use(session({
    secret: 'secret',
    maxAge: new Date(Date.now() + 3600000), //1 Hour
    expires: new Date(Date.now() + 3600000), //1 Hour
    saveUninitialized: true,
    resave: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.static(path.join(__dirname, '/uploads/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

//template engine
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use('/auth', Auth);
app.use('/home', Home)

app.get('/', (req, res) => {
    res.redirect('/auth/login')
});

app.get('/logout', function (req, res) {
    req.logOut();
    req.session.destroy(function (err) {
        res.redirect('/auth/login'); //Inside a callback… bulletproof!
    });
});

// setup error handler
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
io.on("connection", socketManager);

server.listen(port, () => {
    debug(`Server running on port ${chalk(`${port}`)}`);
})
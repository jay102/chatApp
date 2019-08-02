const express = require('express');
const debug = require('debug')('app');
const chalk = require('chalk').green;
const morgan = require('morgan');
const path = require('path');

//import routes
const Auth = require('./src/routes/Auth/auth');

//declare port
const port = process.env.PORT || 5000;

const app = express();
//Middlewares
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

//template engine
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/auth', Auth);

app.get('/', (req, res) => {
    res.redirect('/auth/login')
});


app.listen(port, () => {
    debug(`Server running on port ${chalk(`${port}`)}`);
})
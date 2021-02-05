var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var routesRouter = require('./routes/routes');
var loginRouter = require('./routes/login');
var profileRouter = require('./routes/profile');
var dumpsterRouter = require('./routes/dumpster');
var mainMenuRouter = require('./routes/mainMenu');
var userRouter = require('./routes/user');
var aboutUsRouter = require('./routes/aboutUs');
var forgetPassRouter = require('./routes/forgetPassword');
var depotRouter = require('./routes/depot');
var driverRouter = require('./routes/driver');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// app.use(express.json());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/profile', profileRouter);
app.use('/dumpster', dumpsterRouter);
app.use('/mainMenu', mainMenuRouter);
app.use('/user', userRouter);
app.use('/aboutUs', aboutUsRouter);
app.use('/forgetPassword',forgetPassRouter);
app.use('/reset',forgetPassRouter);
app.use('/api', apiRouter);
app.use('/routes', routesRouter);
app.use('/depot', depotRouter);
app.use('/driver', driverRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');

    //callback
    next();
});

module.exports = app;

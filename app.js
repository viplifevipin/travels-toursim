var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressHbs=require('express-handlebars')
var logger = require('morgan');
var mongodb=require('mongodb')
var db=require('./database/dbConfig')
var session=require('express-session')
var passport=require('passport')
var flash=require('connect-flash')

require('dotenv').config()


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var enquiryRouter=require('./routes/enquiry')
var app = express();


// view engine setup
app.engine('.hbs', expressHbs({
  extname: '.hbs',
  defaultLayout: 'layout',
  partialsDir: path.join(__dirname, 'views/partials'),
  layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', '.hbs');
app.set('views',path.join(__dirname,'views'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash())
app.use(session({
  secret: 'somesecret',
  resave: false,
  saveUninitialized: false
}))
// using the custom middleware for storing variable in response
app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  next()
})
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {

  res.locals.login=req.isAuthenticated();
  res.locals.session=req.session;
  next();

})

// app.use(function (req,res,next) {
//   res.locals.login=req.isAuthenticated();
//   next();
// })


app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter);
app.use('/enquiry',enquiryRouter)


// catch 404 and forward to error handler
 app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

db.connect(function (error) {

  if (error){
    console.log('Unable to connect database');
    process.exit(1);
  } else {
    console.log('Database connected successfully...');
  }

});

module.exports = app;

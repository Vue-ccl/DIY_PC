const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session= require('express-session')
const cors= require('cors')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
app.use(session({
  secret: 'pc_key',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 60 * 60 * 100}, //最后一位小时 设置session的有效时间, 单位ms
}))
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 请求拦截
app.use(function (req, res, next) {
  var arr = req.url.split('/');
  if (req.session.userId) {
    //用户登录过
    next();
  }else{
    if (arr[1]=='users') {
      next()
    }else{
      console.log('333');
      // res.redirect('/api/users/user_info') // 重定向
      res.json({ redirect_code: 200,message:'登录过期,请重新登录!'});  
      res.end();
    }
  }
});


app.use('/api', indexRouter);
app.use('/users', usersRouter);


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

module.exports = app;

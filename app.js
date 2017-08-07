var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
const session = require('express-session')
var bodyParser = require('body-parser')
const passport = require('passport')
const MongoStore = require('connect-mongo')(session)
var app = express()

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://192.168.1.98:8080')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
}
app.use(allowCrossDomain)
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json({ 'limit':'1000kb' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  name: 'lala',
  secret: 'keyboard cat',// 与cookieParser中的一致
  resave: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
  store: new MongoStore({
		url: 'mongodb://localhost/test',
		touchAfter: 24 * 3600 // time period in seconds
	}),
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')))


// 启动用户接口
app.use(require('./routes/index'))

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack)
  console.log(next)
  res.status(500).send('Something broke!')
})

module.exports = app

app.listen(4000, function () {
  console.log('服务运行在４０００')
})

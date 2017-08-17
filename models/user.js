/**
 * 用户表
 */
// const crypto = require('crypto')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportLocalMongoose = require('passport-local-mongoose')
const UserSchema = new Schema({
  username: String,
  password: String,
  token: String,
  phone: Number,
  avatar: String,
  age: { type: Number, default: 18 },
  articles: { type: Schema.Types.ObjectId }
})
UserSchema.plugin(passportLocalMongoose, {
  limitAttempts: 5,
  maxAttempts: 5,
  // selectFields: 'last attempts',
  errorMessages: {
    UserExistsError: '用户已注册',
    MissingUsernameError: '用户名不能为空',
    MissingPasswordError: '密码不能为空',
    AttemptTooSoonError: '请休息一下，稍后重试',
    TooManyAttemptsError: '尝试次数过多，请稍后重试',
    IncorrectPasswordError: '密码错误',
    IncorrectUsernameError: '账号错误',
    NoSaltValueStoredError: '账号出错，保存失败'
  }
})
// UserSchema.methods.validPassword = function (password) {
//   var hash = crypto.pbkdf2Sync(password, this.salt, 25000, 512, 'sha256').toString('hex')
//   return this.hash === hash
// }
const User = mongoose.model('user', UserSchema)
// 登录验证
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

module.exports = User
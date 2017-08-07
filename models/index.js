const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test', {
  useMongoClient: true
}, function (err) {
  if (err) return process.exit(1)
  console.log('数据库链接成功')
})
// 初始化mongoose.Promise
mongoose.Promise = global.Promise

const User = require('./user')
const Article = require('./article')
const Pub = require('./pub_book')
module.exports = {
  Article,
  User,
  Pub
}


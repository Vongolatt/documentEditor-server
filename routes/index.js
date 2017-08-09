/**
 * 路由管理
 */

const express = require('express')
const router = express.Router()

router.use(function (req, res, next) {
  // console.log(req.isAuthenticated())
  console.log(req.user)
  next()
})
// v1版本
// 登录注册
require('./v1/account_register')(router)
require('./v1/account_login')(router)
// 文章管理
require('./v1/article_edit')(router)
require('./v1/article_query')(router)
require('./v1/article_del')(router)
require('./v1/article_add')(router)
require('./v1/article_list')(router)

// 发布文档
require('./v1/pub_book_add')(router)
require('./v1/pub_book_query')(router)
require('./v1/pub_book_list')(router)
require('./v1/pub_book_edit')(router)
require('./v1/pub_book_del')(router)
module.exports = router
/**
 * 文章
 */

const Article = require('../../models').Article
const async = require('async')

module.exports = function (router) {
  router.post('/v1/article/del', (req, res) => {
    let id = req.body.id
    async.waterfall([
      function (cb) {
        if (!id) return cb(4003)
        cb(null)
      },
      function (cb) {
        Article.findOneAndRemove({ _id: id }, (err, article) => {
          if (err) return cb(5001)
          if (!article) return cb(5002)
          cb(200)
        })
      }
    ], (status) => {
      if (status === 4003) return res.json({ status, message: '文章id不能为空' }) 
      if (status === 5001) return res.json({ status, message: '系统错误' })       
      if (status === 5002) return res.json({ status, message: '没有找到文章' })
      res.json({
        status: status,
        message: '删除成功'
      })
    })
  })
}
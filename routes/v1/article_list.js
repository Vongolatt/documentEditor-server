/**
 * 文章
 */

const Article = require('../../models').Article
const async = require('async')

module.exports = function (router) {
  router.get('/v1/article/list', ({ query: { author, label, title, sort, limit, page } }, res) => {
    async.waterfall([
      function (cb) {
        if (!page || !limit) return cb (4003)
        page = (page - 1) * limit
        limit = limit * 1
        cb(null)
      },
      function (cb) {
        const reg = new RegExp(title, 'i')
        Article.findFilter({ author, label, title: reg, sort }).Filter(page, limit).exec((err, docs) => {
          console.log(err)
          if (err) return cb(5001)
          cb(docs)
        })
      }
    ], (status) => {     
      if (status === 4003) return res.json({ status, message: '参数错误' })
      if (status === 5001) return res.json({ status, message: '系统错误' })
      res.json({
        status: 200,
        data: status
      })
    })
  })
}
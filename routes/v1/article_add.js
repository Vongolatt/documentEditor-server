
/**
 * 文章
 */

const Article = require('../../models').Article
const async = require('async')

module.exports = function (router) {
  router.post('/v1/article/add', (req, res) => {
    const tag = req.body.tag || undefined
    const title = req.body.title
    async.waterfall([
      function (cb) {
        if (!title) return cb(4030)       
        Article.create({ author: req.user._id, tag, amend_times: 0, title }, (err) => {
          if (err) {
            console.log(err) 
            return cb(5001) 
          }
          cb(200)
        })
      }
    ], (status) => {
      if (status === 5001) return res.json({ status, message: '系统错误' })
      if (status === 4030) return res.json({ status, message: '参数错误' })        
      res.json({
        status: 200,
        message: '添加文章成功'
      })
    })
  })
}
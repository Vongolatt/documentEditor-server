/**
 * 更新文章
 */


const Article = require('../../models').Article
const async = require('async')

module.exports = function (router) {
  router.get('/v1/article/query', (req, res) => {
    const id = req.query.id
    async.waterfall([
      function (cb) {
        Article.findById(id, { __v: 0, create_time: 0 }).populate('author', '-_id -__v -last -attempts').exec((err, doc) => {
          if (!doc) return cb(4003)
          cb(null, doc)
        })
      }
    ], (status, doc) => {
      if (status === 4003) return res.json({ status, message: '没有找到文章' })        
      res.json({
        status: 200,
        data: { article: doc }
      })
    })
  })
}
/**
 * 文章
 */

const Article = require('../../models').Article
const async = require('async')

module.exports = function (router) {
  router.get('/v1/article/list', (req, res) => {
    const author = req.query.author
    const tag = req.query.tag
    let page = req.query.page
    let limit = req.query.limit

    async.waterfall([
      function (cb) {
        if (!page || !limit) return cb (4003)
        page = (page - 1) * limit
        limit = limit * 1
        cb(null)
      },
      function (cb) {
        if (!author) return cb(null)
        Article.find({ author }).populate('author', '-_id -__v -last -attempts').sort({ create_time: -1 }).skip(page).limit(limit).exec((err, docs) => {
          if (err) return cb(5001)
          cb(docs)
        })
      },
      function (cb) {
        if (!tag) return cb(null)
        Article.find({ tag }).populate('author', '-_id -__v -last -attempts').sort({ create_time: -1 }).skip(page).limit(limit).exec((err, docs) => {
          if (err) return cb(5001)
          cb(docs)
        })
      },
      function (cb) {
        Article.find().populate('author', '-_id -__v -last -attempts').sort({ create_time: -1 }).skip(page).limit(limit).exec((err, docs) => {
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
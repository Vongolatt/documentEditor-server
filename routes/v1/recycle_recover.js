/**
 * 删除回收站文章
 */

const { Recycle, Article, Sort } = require('../../models')
const async = require('async')

module.exports = function (router) {
  router.post('/v1/recycle/recover', ({ body: { id } }, res) => {
    let recDoc = {}
    async.waterfall([
      cb => {
        if (!id) return cb(4003,'参数错误')
        Recycle.findById(id).exec((err, doc) => {
          if (err) return cb(5001, '系统错误')
          if (!doc) return cb(5002, '没有找到文章')
          recDoc = doc
          cb(null, doc.toObject())
        })
      },
      (doc, cb) => {
        Sort.findOneAndUpdate({ name: doc.sort },{ $push: { articles: doc._id } }, {
          upsert: true
        }).exec((err, sort) => {
          if (err) return cb(5001, '系统错误')
          if (!sort) return cb(5002, '没有找到文章')
          doc.sort = sort._id
          cb(null, doc)
        })
      },
      (doc, cb)  => {
        Article.create(doc, (err, doc) => {
          if (err || !doc ) return cb(5001, '系统错误')
          recDoc.remove()
          cb(200)
        })
      }
    ], (status, result) => {
      if (status !== 200) return res.json({ status, message: result })
      res.json({
        status: status,
        message: '恢复成功'
      })
    })
  })
}
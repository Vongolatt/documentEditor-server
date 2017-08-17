
/**
 * 文章
 */

const { Article, Sort } = require('../../models')
const async = require('async')

module.exports = function (router) {
  router.post('/v1/article/add', ({ body: { label, title, sort }, user: { _id } }, res) => {

    async.waterfall([
      cb => {
        console.log(label, title, sort, _id)
        // 添加API文档
        if (!title) return cb(4030)
        if (label === 'List') return cb(null)
        // 将sort保存为项目id
        Article.create({ author: _id, amend_times: 0, title }, (err, doc) => {
          if (err) {
            if (err.code === 11000) return cb(4031)
            return cb(5001)
          }
          if (!doc) return cb(5001)
          cb(200)
        })
      },
      cb => {
        // 添加技术文档
        if (!sort) return cb(4030)
        Article.create({ author: _id, label, amend_times: 0, title, sort }, (err, doc) => {
          if (err) {
            console.log(err)
            if (err.code === 11000) return cb(4031)
            return cb(5001) 
          }
          if (!doc) return cb(5001)
          cb(null, doc)
        })
      },
      (doc, cb) => {
        Sort.findByIdAndUpdate(sort,{ $push: { articles: doc._id } }).exec((err, sort) => {
          if (err) {
            doc.remove()
            return cb(5001)
          }
          if (!sort) return cb(4030)
          cb(200) 
        })
      }
    ], (status) => {
      if (status === 5001) return res.json({ status, message: '系统错误' })
      if (status === 4030) return res.json({ status, message: '参数错误' })
      if (status === 4031) return res.json({ status, message: '标题重复' })                        
      res.json({
        status,
        message: '添加文章成功'
      })
    })
  })
}
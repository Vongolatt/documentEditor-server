/**
 * 文章
 */

const { Article, Recycle } = require('../../models')
const async = require('async')

module.exports = function (router) {
  router.post('/v1/article/del', ({ body: { id, sort } }, res) => {
    async.waterfall([
      cb => {
        if (sort) return cb(null)        
        if (!id) return cb(4003, '文章id不能为空')
        Article.findByIdAndRemove(id).exec( (err, doc) => {
          if (err) return cb(5001, '系统错误')
          if (!doc) return cb(5002, '没有找到文章')
          const delArticle = doc.toObject()
          Recycle.create(delArticle, (err, doc) => {
            console.log(err)          
            if (err) return cb(5001, '系统错误')
            if (!doc) return cb(5002, '删除失败')
            cb(200)            
          })
        })
      },
      cb => {
        Article.find({ _id: { $in: sort } }).exec( async (err, docs) => {
          if (err) return cb(5001, '系统错误')
          if (!docs || !docs.length) return cb(5002, '没有找到文章')
          // const result = await Article.remove({ _id: { $in: sort } })
          // if (!result.result.ok) return cb(5001, '系统错误')
          const delArticle = docs.map(doc => {
            return doc.toObject()
          })
          Recycle.create(delArticle, (err, doc) => {
            console.log(err)          
            if (err) return cb(5001, '系统错误')
            if (!doc) return cb(5002, '删除失败')
            cb(200)            
          })
        })
      }
    ], (status, result) => {
      if (status !== 200) return res.json({ status, message: result })
      res.json({
        status: status,
        message: '删除成功'
      })
    })
  })
}
/**
 * 文章
 */

const { Article, Recycle, Sort } = require('../../models')
const async = require('async')

module.exports = function (router) {
  router.post('/v1/article/del', ({ body: { id } }, res) => {
    async.waterfall([
      cb => {
        if (!id) return cb(4003, '文章id不能为空')
        Article.findByIdAndRemove(id).exec( async (err, doc) => {
          if (err) return cb(5001, '系统错误')
          if (!doc) return cb(5002, '没有找到文章')
          const delArticle = doc.toObject()
          // 从分类列表删除该文章id
          const sort = await Sort.findByIdAndUpdate(doc.sort, { $pull: { articles: doc._id } } )
          delArticle.sort = sort.name
          cb(null, delArticle)
        })
      },
      (delArticle, cb) => {
        Recycle.create(delArticle, (err, doc) => {
          console.log(err)          
          if (err) return cb(5001, '系统错误')
          if (!doc) return cb(5002, '删除失败')
          cb(200)            
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
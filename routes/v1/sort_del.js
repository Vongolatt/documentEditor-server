const { Article, Sort, Recycle } = require('../../models')
const { waterfall } = require('async')

module.exports = router => {
  router.post('/v1/sort/del', ( { body: { sort_id } }, res) => {
    waterfall([
      cb => {
        if (!sort_id) return cb(4003, '参数错误')
        Sort.findById(sort_id).exec((err, sort) => {
          if (err) return cb(5001, '系统错误')
          if (!sort) return cb(5002, '没有找到文章')
          cb(null, sort)
        })
      },
      (sort, cb) => {
        Article.find({ _id: { $in: sort.articles } }).exec( async (err, docs) => {
          if (err) return cb(5001, '系统错误')
          if (!docs || !docs.length) return cb(5002, '没有找到文章')
          await Article.remove({ _id: { $in: sort.articles } })
          await sort.remove()
          const delArticle = docs.map(doc => {
            let docObj = doc.toObject()
            docObj.sort = sort.name
            return docObj
          })
          Recycle.create(delArticle, (err, doc) => {
            console.log(err)          
            if (err) return cb(5001, '系统错误')
            if (!doc) return cb(5002, '删除失败')
            cb(200)            
          })
        })
      }
    ], (status, message) => {
      if (status !== 200) return res.json({ status, message })
      res.json({
        status: status,
        message: '删除成功'
      })
    })
  })
}
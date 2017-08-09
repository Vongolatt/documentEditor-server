/**
 * 文章
 */

const { Article } = require('../../models')
const async = require('async')

module.exports = function (router) {
  router.post('/v1/article/del', ({ body: { id } }, res) => {
    async.waterfall([
      cb => {
        Article.findByIdAndUpdate(id, { deletedAt: new Date() }).exec( err => {
            console.log(err)
            if (err) return cb(5001)
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
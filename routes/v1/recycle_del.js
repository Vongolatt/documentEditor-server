/**
 * 删除回收站文章
 */

const { Recycle } = require('../../models')
const async = require('async')

module.exports = function (router) {
  router.post('/v1/recycle/del', ({ body: { id } }, res) => {
    async.waterfall([
      cb => {
        if (!id) return cb(null)
        Recycle.findByIdAndRemove(id).exec((err, doc) => {
          if (err) return cb(5001, '系统错误')
          if (!doc) return cb(5002, '没有找到文章')
          cb(200)
        })
      },
      cb => {
        Recycle.remove({}).exec((err, res) => {
          if (err) return cb(5001, '系统错误')
          if (!res.result.ok) return cb(5002, '没有找到文章')
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
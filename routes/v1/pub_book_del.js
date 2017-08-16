
const { Pub } = require('../../models')
const { waterfall } = require('async')

module.exports = router => {
  router.post('/v1/pub/del', ({ body: { id } }, res) => {
    waterfall([
      cb => {
        if (!id) return cb(4003, '文章id不能为空')
       Pub.findByIdAndRemove(id).exec( (err, doc) => {
            if (err) return cb(5001, '系统错误')
            if (!doc) return cb(5002, '没有找到文章')
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
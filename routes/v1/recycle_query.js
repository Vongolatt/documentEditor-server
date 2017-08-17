const { Recycle } = require('../../models')
const { waterfall } = require('async')
module.exports = router => {
  router.get('/v1/recycle/query', ({ query: { id } }, res) => {
    waterfall([
      cb => {
        if (!id) return cb(4003, '参数错误')      
        Recycle.findById(id, (err, doc) => {
          if (err || !doc) return cb(5003, '系统错误')
          cb(200, doc)
        })
      }
    ], (status, message) => {
      if (status !== 200) return res.json({ status, message })
      res.json({
        status,
        data: { doc: message }
      })
    })
  })
}
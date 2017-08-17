const { Recycle } = require('../../models')
const { waterfall } = require('async')
module.exports = router => {
  router.get('/v1/recycle/list', (req, res) => {
    waterfall([
      cb => {
        Recycle.find({}, (err, docs) => {
          if (err || !docs) return cb(5003, '系统错误')
          cb(200, docs)
        })
      }
    ], (status, message) => {
      res.json({
        status,
        data: { docs: message }
      })
    })
  })
}
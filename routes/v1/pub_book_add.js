const { Pub } = require('../../models')
const { waterfall } = require('async')
module.exports = function (router) {
  router.post('/v1/pub/add', function ({ body: { label } }, res) {
    waterfall([
      cb => {
        if (!label) return cb(4030)
        Pub.create({ label },err => {
          if (err) return cb(5001)
          cb(200)
        })
      },
    ], function (status) {
      if (status === 4030) {return res.json({ status, message: '参数错误' })}      
      if (status === 5001) {return res.json({ status, message: '系统内部错误' })}
      res.json({ status, message: '添加成功' })
    })
  })
}
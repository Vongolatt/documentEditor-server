const Pub = require('../../models').Pub
const waterfall =  require('async/waterfall')

module.exports = router => {
  router.get('/v1/pub/query', ({ query }, res) => {
  const id = query.id
  waterfall([
    cb => {
      if (!id) return cb (4030, '参数错误')
      Pub.findById(id).Filter()
      .exec((err, doc) => {
        console.log(err)
        if (err) return cb (5020, '系统内部错误')
        cb(null, doc)
      })
    }
  ], (err, message) => {
    if (err) return res.json({ status: err, message })
    res.json({ status: 200, data: { pub: message } })      
  })
  })
}
const Pub = require('../../models').Pub
module.exports = router => {
  router.get('/v1/pub/list', (req, res) => {
    Pub.find({}).Filter().exec((err, pubs) => {
      if (err) return res.json({ status: 5020, message: '系统内部错误' })
      res.json({ status: 200, data: { pubs } })
    })
  })
}
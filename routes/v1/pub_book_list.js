const Pub = require('../../models').Pub
const { waterfall } = require('async')
module.exports = router => {
  router.get('/v1/pub/list', ({ query: { author, tag, page, limit } }, res) => {
    waterfall([
      cb => {
        if (!page || !limit) return cb (4030, '参数错误')
        page = (page - 1) * limit
        limit = limit * 1
        cb(null)
      },
      cb => {
        Pub.findFilter({ author, tag }).Filter().sort({ create_time: -1 }).skip(page).limit(limit).exec((err, pubs) => {
          if (err) return cb(5020, '系统内部错误')
          cb(200, pubs)
        })
      }
    ], (err, result) => {
      if (err !== 200) return res.json({ status: err, message: result })
      res.json({ status: 200, pubs: result })
    })

  })
}
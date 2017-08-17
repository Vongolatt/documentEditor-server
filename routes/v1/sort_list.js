const { Sort } = require('../../models')
const { waterfall } = require('async')
module.exports = router => {
  router.get('/v1/sort/list', (req, res) => {
    waterfall([
      cb => {
        Sort.find({}, (err, docs) => {
          if (err || !docs) return cb(5002, '系统错误')
          const sorts = docs.map((sort) => {
            return sort.name
          })
          cb(200, sorts)
        })
      }
     ], (status, message) => {
      if (status === 200) return res.json({
        status,
        data: { sorts:message }
      })
      res.json({ status,message })
    })
  })
}
const Sort = require('../../models').Sort
const { waterfall } = require('async')
module.exports = router => {
  router.post('/v1/sort/add', ({ body: { name } }, res) => {
    waterfall([
      cb => {
        if (!name) return cb(4003, '参数错误')
        Sort.create({ name }, (err, doc) => {
          if (err &&  err.code === 11000) return cb(4002, '分类名不能重复')
          if (err || !doc) return cb(5002, '系统错误')
          cb(200, '添加成功')
        })
      }
    ], (status, message) => {
      res.json({ status,message })
    })
  })
}
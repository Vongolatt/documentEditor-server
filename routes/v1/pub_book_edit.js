const { Pub } = require('../../models')
const { waterfall } = require('async')
const ge_book = require('../../generate')
module.exports = router => {
  router.post('/v1/pub/edit', ({ body: { id, title, directory } }, res) => {
    waterfall([
      cb => {
        if (!id) return cb(4030, '参数错误')
        Pub.UpdateFilter(id, { title, directory }).Filter().exec((err,{ directory, _id, title ,author: { username } }) => {
          if (err) return cb(5020, '系统错误')
          ge_book(directory, title, username, _id)
          cb(200, '修改成功')
        })
      },
      cb => {
        if (title) return cb(null)
        Pub.findById(id).Filter().exec((err,{ directory, _id, title,author: { username } }) => {
          if (err) return cb(5020, '系统错误')
          ge_book(directory, title, username, _id)
          cb(200, '修改成功')
        })
      },
      cb => {
        console.log(title)
        Pub.findByIdAndUpdate(id, { title }).Filter().exec((err,{ directory, _id,author: { username } }) => {
          if (err) return cb(5020, '系统错误')
          ge_book(directory, title, username, _id)
          cb(200, '修改成功')          
        })
      }
    ], (err, result) => {
      res.json({ status: err, message: result })
    })
  })
}
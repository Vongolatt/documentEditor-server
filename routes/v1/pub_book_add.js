
const Pub = require('../../models').Pub
const async = require('async')
const ge_book = require('../../generate')
module.exports = function (router) {
  router.post('/v1/pub/add', function (req, res) {
    const { title, tag, directory } = req.body
    async.waterfall([
      function (cb) {
        if (!directory || !title || !tag) return cb(4030)
        Pub.create({ author: req.user._id, tag, amend_times: 0, directory , title }, (err, doc) => {
          if (err) return cb(5001)
          cb(null, doc._id)
        })
      },
      function (id, cb) {
        // 启动gitbook-cli
        ge_book(directory, title, req.user.username, id).catch(e => {
          console.log(e)
        }) 
        cb(200)
      }
    ], function (status) {
      if (status === 4030) {return res.json({ status, message: '参数错误' })}
      if (status === 5001) {return res.json({ status, message: '系统内部错误' })}
      res.json({ status, message: '发布成功' })
    })
  })
}
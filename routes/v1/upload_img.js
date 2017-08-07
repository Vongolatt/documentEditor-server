// 上传图片

const Img = require('../../models').Img
const async = require('async')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
module.exports = function (router) {
  router.post('/v1/img', upload.single('lala', 3), (req, res) => {
    console.log(1, req.body, req.file)
    const file = req.body.file
    const title = req.body.title
    const id = req.body.id
    // const password = req.body.password
    async.waterfall([
      function (cb) {
        if (!file) return cb(4001)
        if (!title) return cb(4002)
        if (!id) return cb(4003)
        cb(null)
      },
      function (cb) {
        const newImg = new Img({
          file,
          title,
          id                   
        })
        newImg.save((err, res) => {
          if (err) cb(5001)
          console.log(res)
          cb('添加成功')
        })
      }
    ], ( err ) => {
      console.log(err)
      if (err === 4001) return res.json({ status: err, message: '文件不能为空' })
      if (err === 4002) return res.json({ status: err, message: '标题不能为空' })
      if (err === 4003) return res.json({ status: err, message: '文章id不能为空' })      
      if (err === 5001) return res.json({ status: err, message: '系统错误' })
      res.json({
        status: 200,
        message: '上传成功'
      })
    })
  })
}
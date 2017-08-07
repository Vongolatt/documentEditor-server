/**
 * 更新文章
 */

const Article = require('../../models').Article
const async = require('async')
const crypto = require('crypto')
const { static_path } = require('../../config')
const fs = require('fs-extra')

module.exports = function (router) {
  router.post('/v1/article/edit', (req, res) => {
    let content = req.body.content
    const id = req.body.id
    const pics = req.body.pics
    async.waterfall([
      function (cb) {
        // 验证参数是否存在
        if (!id) return cb(4003)                  
        if (!content) return cb(4001)
        cb(null)
      },
      function (cb) {
        if (!Object.keys(pics).length) return cb(null)
        Object.keys(pics).map((name, index, arr) => {
          // 将base64转为二进制
          const pic = pics[name].replace(/^data:image\/\w+;base64,/, '')
          const dataBuffer = new Buffer(pic, 'base64')
          // 根据二进制流生成唯一md5，去除重复图片
          const hash = crypto.createHash('md5')
          hash.update(dataBuffer)
          const fileName = 'pic/' + hash.digest('hex')
          // 将二进制图片写入文件
          fs.writeFile('public/' + fileName, dataBuffer, function (err){
            if (err) return cb(5002)
            console.log(fileName + '缓存成功!')
            // 将对应图片地址换成服务器地址
            const reg = new RegExp('(!\\[[\\w\\W]+?\\]\\().\\/[' + index + ']+?(\\))', 'g')
            console.log(reg)
            content = content.replace(reg, '$1' + static_path + fileName + '$2')
            if (arr.length === index + 1) cb(null)
          })
        })
      },
      function (cb) {
        Article.findByIdAndUpdate({ _id: id }, { content, $inc: { amend_times: 1 } }, (err, article) => {
          if (err) cb(5001)
          if (!article) cb(4003)
          cb('更新成功')
        })
      }
    ], (status) => {
      if (status === 4001) return res.json({ status, message: '内容不能为空' })
      if (status === 4003) return res.json({ status, message: '没有找到文章' })        
      if (status === 5001) return res.json({ status, message: '系统错误' })
      if (status === 5002) return res.json({ status, message: '图片保存失败' })
      res.json({
        status: 200,
        message: status
      })
    })
  })
}
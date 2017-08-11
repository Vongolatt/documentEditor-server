
const { Pub, Article } = require('../../models')
const { waterfall, queue } = require('async')
const ge_book = require('../../generate')
const q = queue(({ directory, title, user, id, queryList }, cb ) => {
  ge_book(directory, title, user.username, id, queryList)
  .then(() => {
    cb()
  })
  .catch(e => {
    cb(e)
  })
})
// 监听：当所有任务都执行完以后，将调用该函数
q.drain = function (){
    console.log('all tasks have been processed')
}
module.exports = function (router) {
  router.post('/v1/pub/add', function ({ body: { title, tag, levelOne, levelTwo }, user }, res) {
    const directory = []
    const queryList = []
    waterfall([
      cb => {
        if (!levelOne || !title || !tag || !levelTwo) return cb(4030)
        if (!Array.isArray(levelOne) || typeof levelTwo !== 'object') return cb(4030)
        cb(null)
      },
      cb => {
        const titleList = []
        Object.keys(levelTwo).map( dir => {
          titleList.push(...levelTwo[dir])
        })
        const articleList = titleList.map( title => {
          return Article.findOne({ title })
        })
        Promise.all(articleList).then( articles => {
          queryList.push(...articles)
          cb(null)
        })
        .catch( e => {
          console.log(e)
          return cb(5001)
        })
      },
      cb => {
        // 生成目录
        levelOne.map( dir1 => {
          let temdir = { pri_dir: '', sec_dir: [] }
          temdir.pri_dir = dir1
          levelTwo[dir1].map( async title => {
            if (!title) return cb(5001)
            // 填入二级目录
            temdir.sec_dir.push({ title })
          })
          directory.push(temdir)
        })
        cb(null)
      },
      cb => {
        Pub.create({ author: user._id, tag, amend_times: 0, directory , title }, (err, doc) => {
          console.log(err)
          if (err) return cb(5001)
          cb(null, doc._id)
        })
      },
      (id, cb) => {
        // 启动gitbook-cli
        q.push({
          directory, title, user:user.username, id, queryList
        }, (err) => {
          if (err) return cb(5020)
          console.log('finish' + id )
        })
        cb(200)
      }
    ], function (status) {
      if (status === 4030) {return res.json({ status, message: '参数错误' })}
      if (status === 5001) {return res.json({ status, message: '系统内部错误' })}
      if (status === 5020) {return res.json({ status, message: '系统正忙，请稍后发布' })}      
      res.json({ status, message: '发布成功' })
    })
  })
}
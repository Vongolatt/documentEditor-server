const User = require('../models').User
const Sort = require('../models').Sort
const Article = require('../models').Article

// 数据元凶
const faker = require('faker/locale/zh_CN')
// 套路node执行顺序
const async = require('async')
// 
const crypto = require('crypto')

async.waterfall([
  function (cb) {
    let salt = fakersalt()
    // 用户数据填充
    const arrUser = []
    for (let n = 0; n < 5; n++) {
      arrUser.push({
        username: faker.lorem.words(),
        salt: salt,
        hash: fakerHash(salt),
        phone: Math.floor(faker.phone.phoneNumber('1##########')), // formart
        avatar: faker.image.avatar(),
        age: faker.random.number(70)
      })
    }
    // 创建用户
    User.create(arrUser, (err) => {
      if (err) return cb(err)
      cb(null)
    })
  },
  function (cb) {
    // 分类数据填充
    const arrSort = []
    for (let m = 0; m < 10; m++) {
      arrSort.push({
        name: faker.random.word()
      })
    }
    // 创建分类
    Sort.create(arrSort, (err) => {
      if (err) return cb(err)
      cb(null)
    })
  },
  function (cb) {
    async.parallel({
        userData: function (callback) {
          // User查询前5个
          User.find().limit(5).exec((err, users) => {
            if (err) return callback(err)
            callback(null, users)
          })
        },
        sortData: function (callback) {
          // Sort查询前10个
          Sort.find().limit(10).exec((err, sorts) => {
            if (err) return callback(err)
            callback(null, sorts)
          })
        }
      },
      function (err, results) {
        if (err) return cb(err)
        // 进入下一步 
        cb(null, results)
      })
  },
  function (data, cb) {
    // 创建label数组
    const labelArr = ['API', 'List']
    // 生成分类数组
    let sorts = []
    for (let sort of data.sortData) {
      sorts.push(sort._id)
    }
    // 生成tag数组
    // 文章数据填充
    const arrArticle = []
    for (let user of data.userData) {
      for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
        arrArticle.push({
          author: user._id,
          title: faker.name.title(),
          content: faker.lorem.paragraphs(),
          label: getRandom(labelArr),
          tag: randomTagArr(),
          sort: getRandom(sorts),
          amend_times: faker.random.number(10)
        })
      }
    }
    // 创建文章
    Article.create(arrArticle, (err) => {
      if (err) return cb(err)
      cb(null, data)
    })
  },
  // 在分类中回填关联的文章id
  function (data, cb) {
    // 循环分类获得_id
    for (let sort of data.sortData) {
      // 根据分类_id查询文章中sort，相同的输出
      Article.find({
        'sort': sort._id
      }).exec((err, artDocs) => {
        let articleDoc = []    
        if (err) return cb(err)
        // 循环文章文档，保存文章id数组
        for (let artdoc of artDocs) {
          articleDoc.push(artdoc._id)
        }
        // 在相应的分类中保存文章id数组
        Sort.findOne({
          '_id': sort._id
        }).exec((err, sortDoc) => {
          if (err) return cb(err)
            sortDoc.articles = articleDoc
            sortDoc.save()         
        })
      })
    }
    cb(null, 0)
  }
], function (err, result) {
  if (err) return console.log(err)
  if (result === 0) {
    console.log('by whyccup')
  }
  // 更新分类
})

// 从数组中随机取一个值
function getRandom (arr) {
  return arr[Math.floor((Math.random() * arr.length))]
}

// 随机生成tag数组
function randomTagArr () {
  let arr = []
  for (var c = 1; c < Math.floor(Math.random() * 10); c++) {
    arr.push(faker.lorem.word())
  }
  return arr
}

// 使用固定password生产salt和hash
function fakersalt () {
  let salt = crypto.randomBytes(32).toString('hex')
  return salt
}

function fakerHash (salt) {
  let hash = crypto.pbkdf2Sync('123456', salt, 25000, 512, 'sha256').toString('hex')
  return hash
}
const User = require('../models').User
const Sort = require('../models').Sort
const Article = require('../models').Article
// const Recycle = require('../models').Recycle
// const Pub = require('../models').Pub
// 数据元凶
const faker = require('faker/locale/zh_CN')
// 套路node执行顺序
const async = require('async')

// 随机数组中随机取几个元素
// function getRandomArrayElements(arr, count) {
//   let shuffled = arr.slice(0),
//     i = arr.length,
//     min = i - count,
//     temp, index
//   while (i-- > min) {
//     index = Math.floor((i + 1) * Math.random())
//     temp = shuffled[index]
//     shuffled[index] = shuffled[i]
//     shuffled[i] = temp
//   }
//   return shuffled.slice(min)
// }

async.waterfall([
  function (cb) {
    // 用户数据填充
    const arrUser = []
    for (let n = 0; n < 100; n++) {
      arrUser.push({
        username: faker.name.firstName() + faker.name.lastName(),
        password: faker.internet.password(),
        token: faker.internet.password(),
        phone: Math.floor(faker.phone.phoneNumber('1##########')), // formart
        avatar: faker.image.avatar(),
        age: faker.random.number(70)
      })
    }
    // 创建用户
    User.create(arrUser)
    // 分类数据填充
    const arrSort = []
    for (let m = 0; m < 10; m++) {
      arrSort.push({
        name: faker.random.word()
      })
    }
    // 创建分类
    Sort.create(arrSort)
    // 进入下一步
    cb(null)
  },
  function (cb) {
    async.parallel({
        userData: function (callback) {
          // User查询前20个
          User.find().limit(20).exec((err, users) => {
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
        if (err) return console.log(err)
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
      for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
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
    Article.create(arrArticle)
    // 进入下一步
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
  for (var c = 0; c < Math.floor(Math.random() * 5); c++) {
    arr.push(faker.lorem.word())
  }
  return arr
}
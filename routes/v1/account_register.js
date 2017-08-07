// 注册接口

const User = require('../../models').User
module.exports = function (router) {
  router.post('/v1/account/register', (req, res) => {
     User.register(new User({ username : req.body.username }), req.body.password, function (err) {
       let status,
           message = '注册成功'
        if (err) {
          switch (err.name) {
            case 'MissingPasswordError':
            status = 4032
            break
            case 'MissingUsernameError':
            status = 4031
            break
            case 'UserExistsError':
            status = 4033
            break
          }
          message = err.message
        }
        res.json({ status, message })
    })
  })
}
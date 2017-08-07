/**
 * 登录接口
 */

const passport = require('passport')

module.exports = function (router) {
  router.post('/v1/account/login', function (req, res) {
    passport.authenticate('local', function (err, user, info) {
      if (!user) {
        res.json({
          status: info.name || 'MissedCredentials' || 4030,
          message: info.message
        })
        return
      }
      const userInfo = { username: user.username, age: user.age }
      req.logIn(user, function () {
        res.json({ 
          status: 200,
          user:userInfo
        })
      })
    })(req, res)
  })
}
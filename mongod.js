const process = require('child_process')
process.exec('cd /home/hefoni/Documents/mongodb-3.4.6 && ./bin/mongod -f /home/hefoni/Documents/mongodb-3.4.6/mongod.conf', function (err, stdout) {
  console.log(stdout, 1)
  console.log('服务器已启动')
})
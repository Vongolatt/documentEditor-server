const process = require('child_process')
// const async = require('async')
const Article = require('./models/index').Article
const queryList = []
const pathList = []
const fs = require('fs-extra')
const summary = 'public/tmps/'
const staticPath = require('./config').static_path
module.exports = async function (directory, title, author, id) {
  // 初始化安装环境
  await fs.copy('gitbook/tmps', 'public/tmps')
  // 生成summary目录
  let content = '# Summary\n\n* [Introduction](README.md)\n'
  directory.map((dir) => {
    // 一级目录
      content += `* ${dir.pri_dir}\n\n`
      for (let sec_dir of dir.sec_dir) {
       // 二级目录 
        const path = `${dir.pri_dir}/${sec_dir}.md`
        content += `* [${sec_dir}](${path})\n`
        // 生成查询列表
        queryList.push(Article.findOne({ title: sec_dir }))
        // 保存所有二级目录路径
        pathList.push(`${summary}${path}`)
      }
      content += '\n'
  })
  const fsRead = fs.writeFile(summary + 'Summary.md', content)
  const bookSetting = fs.readJson('./public/tmps/book.json').then(obj => {
    obj.author = author
    obj.title = title
    obj.links.sidebar['文档地址'] = staticPath + 'pub/' + id
    fs.writeJSON('./public/tmps/book.json', obj)
  })
  .catch(err => {
    console.error(err) // Not called
  })
  await Promise.all([fsRead, bookSetting])
  console.log('init summary success')
  Promise.all(queryList).then( (r) => {
    gitbookBuild(r, id)
  }).catch(e => {
    console.log(e)
  })
}

function gitbookBuild (r, id) {
  // 初始化目录
  process.exec('cd /home/hefoni/Documents/app/public/tmps && gitbook init',async function (err, stdout) {
    console.log(stdout)
    if (err) {
      return console.log('exec error: ' + err)
    }
    if (stdout.indexOf('finished') !== -1) {
      console.log('init direction success')
      const fileList = pathList.map( (path, index) => {
      // 过滤文档内容
      const mk_content = r[index].content.replace(/([^|])\n\|/g, '$1\n\n|').replace(/(-\s[\s\S]+?\n)/g, '$1\n')
      // .replace(/(\n```[\u4e00-\u9fa5\w]+\n)/g, '\n$1')
      // 写入文档内容
      return fs.writeFile(path, mk_content).then( () => {
        // 写入文档修改时间
        fs.utimesSync(path, r[index].create_time, r[index].update_time)
        })
      })
      // 所有文档写入成功后 生成gitbook
      await Promise.all(fileList)
      process.exec('cd /home/hefoni/Documents/app/public/tmps && gitbook build', async (err, stdout) => {
        console.log(stdout)
        if (err) {
          return console.log('exec error: ' + err) 
        }
        if (stdout.indexOf('success') !== -1) {
          // 将书籍移动到发布目录
          await fs.move('public/tmps/_book', 'public/pub/' + id, { overwrite: true }),
          await fs.emptyDir('public/tmps')
          console.log('发布成功')
        }
      })
    }
  })
}

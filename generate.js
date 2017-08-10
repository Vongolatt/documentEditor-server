const { spawn } = require('child_process')
// const async = require('async')
const fs = require('fs-extra')
const summary = 'public/tmps/'
const staticPath = require('./config').static_path
module.exports = async function (directory, title, author, id, articles) {
  const pathList = []
  // 初始化安装环境
  await fs.copy('gitbook/tmps', 'public/tmps')
  // 生成summary目录
  let content = '# Summary\n\n* [Introduction](README.md)\n'
  console.log(directory)
  directory.map((dir) => {
    // 一级目录
      content += `* ${dir.pri_dir}\n\n`
      for (let { title } of dir.sec_dir) {
       // 二级目录 
        const path = `${dir.pri_dir}/${title}.md`
        content += `* [${title}](${path})\n`
        // 保存所有二级目录路径
        pathList.push(`${summary}${path}`)
      }
      content += '\n'
  })
  const fsRead = fs.writeFile(summary + 'Summary.md', content)
  // 写入发布文档的配置信息
  const bookSetting = fs.readJson('./public/tmps/book.json').then(obj => {
    obj.author = author
    obj.title = title
    obj.links.sidebar['文档地址'] = staticPath + 'pub/' + id
    fs.writeJSON('./public/tmps/book.json', obj)
  })
  await Promise.all([fsRead, bookSetting])
  console.log('init summary success')
  gitbookBuild(articles, id)
  function gitbookBuild (r, id) {
    // 初始化目录
    const ls = spawn('gitbook',['init'],{
      cwd: '/home/hefoni/Documents/app/public/tmps'
    })
    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })

    ls.on('close', async (code) => {
      console.log('init direction success')
      console.log(`子进程退出码：${code}`)
      const fileList = pathList.map( (path, index) => {
      // 过滤文档内容
        try {
          const mk_content = r[index].content.replace(/([^|])\n\|/g, '$1\n\n|').replace(/(-\s[\s\S]+?\n)/g, '$1\n')
          // .replace(/(\n```[\u4e00-\u9fa5\w]+\n)/g, '\n$1')
          // 写入文档内容
          return fs.writeFile(path, mk_content).then(() => {
            // 写入文档修改时间
            fs.utimesSync(path, r[index].create_time, r[index].update_time)
          })
        } catch (e) {
          console.log(e)
          console.log('发布失败')
        }
      })
      // 所有文档写入成功后 生成gitbook
      await Promise.all(fileList)
      const cli = spawn('gitbook', ['build'], {
        cwd: '/home/hefoni/Documents/app/public/tmps'
      })
      cli.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
      })
      cli.on('close', async (code) => {
        console.log(`子进程退出码：${code}`)
        await fs.move('public/tmps/_book', 'public/pub/' + id, { overwrite: true }),
        await fs.emptyDir('public/tmps')
        console.log('发布成功')
      })
    })
  }
}
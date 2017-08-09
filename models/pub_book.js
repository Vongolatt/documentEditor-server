// 文章

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const pubSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  title: { type: String, default: '' },
  tag: { type: String, default: 'API', enum: ['API', 'List'] },
  directory: [{}],
  amend_times: { type: Number },
  deletedAt: { type: Date, expires: '24h' }
}, { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } })
// 过滤输出参数
pubSchema.query.Filter = function () {
    return this.populate('author', '-_id -__v -last -attempts')
           .select('-__v -amend_times')
}
// 过滤未定义参数
pubSchema.statics.findByIdUpdateFilter = function (id, params) {
  Object.keys(params).map( key => {
    if (params[key] === undefined) delete params[key]
  })
  console.log(params)
  return this.findByIdAndUpdate(id, params)
}
// 过滤未定义ｃｏｎｄｉｔｉｏｎ
pubSchema.statics.findFilter = function (params) {
  Object.keys(params).map( key => {
    if (params[key] === undefined) delete params[key]
  })
  console.log(params)
  return this.find(params)
}
module.exports = mongoose.model('pub', pubSchema)
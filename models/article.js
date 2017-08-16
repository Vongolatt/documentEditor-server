// 文章

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const articleSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  title: { type: String, required: true, unique: true },
  content: { type: String, default: '' },
  label: { type: String, default: 'API', enum: ['API', 'List'] },
  tag: [String],
  sort: { type: Schema.Types.ObjectId, ref: 'sort' },
  amend_times: { type: Number },
  deletedAt: { type: Date, expires: 10 }
}, { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } })
// 过滤输出参数
articleSchema.query.Filter = function (page, limit) {
  return this.populate('author', '-_id -__v -last -attempts').sort({ create_time: -1 }).skip(page).limit(limit)
}
// 过滤未定义参数
articleSchema.statics.findByIdUpdateFilter = function (id, params) {
  Object.keys(params).map( key => {
    if (params[key] === undefined) delete params[key]
  })
}
// 过滤未定义ｃｏｎｄｉｔｉｏｎ
articleSchema.statics.findFilter = function (params) {
  Object.keys(params).map( key => {
    if (params[key] === undefined) delete params[key]
  })
  console.log(params)
  return this.find(params)
}
module.exports = mongoose.model('article', articleSchema)
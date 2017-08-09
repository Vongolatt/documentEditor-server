// 文章

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const articleSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  title: { type: String, required: true, unique: true },
  content: { type: String, default: '' },
  tag: { type: String, default: 'API', enum: ['API', 'List'] },
  amend_times: { type: Number },
  deletedAt: { type: Date, expires: 10 }
}, { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } })

module.exports = mongoose.model('article', articleSchema)
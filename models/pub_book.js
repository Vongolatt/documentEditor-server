// 文章

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const pubSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  title: { type: String, default: '' },
  tag: { type: String, default: 'API', enum: ['API', 'List'] },
  directory: [{}],
  amend_times: { type: Number },
}, { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } })

module.exports = mongoose.model('pub', pubSchema)
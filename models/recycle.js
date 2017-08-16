const mongoose = require('mongoose')
const Schema = require('mongoose').Schema
const RecycleSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  label: { type: String, default: 'API', enum: ['API', 'List'] },
  tag: [String],
  sort: { type: Schema.Types.ObjectId },
  amend_times: { type: Number },
  deletedAt: { type: Date, expires: 10 }
})

module.exports = mongoose.model('recycle', RecycleSchema)
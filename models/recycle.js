const mongoose = require('mongoose')
const Schema = require('mongoose').Schema
const RecycleSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  title: { type: String },
  content: { type: String, default: '' },
  label: { type: String, default: 'API', enum: ['API', 'List'] },
  tag: [String],
  sort: String,
  amend_times: { type: Number },
  create_time: Date,
  update_time: Date,
  deletedAt: { type: Date, expires: 10 }
})

module.exports = mongoose.model('recycle', RecycleSchema)
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
pubSchema.query.Filter = function () {
    return this.populate('author', '-_id -__v -last -attempts')
           .select('-__v -amend_times')
}

module.exports = mongoose.model('pub', pubSchema)
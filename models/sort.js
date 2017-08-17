const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SortSchema = new Schema({
  name: { type:String, unique: true },
  articles: [{ type: Schema.Types.ObjectId }]
})

module.exports = mongoose.model('sort', SortSchema)

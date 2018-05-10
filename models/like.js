const mongooose = require('mongoose')
const Schema = mongooose.Schema

const likeSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true}
})


likeSchema.index({ user_id: 1, post_id: 1}, { unique: true })


module.exports = mongooose.model('Like', likeSchema, 'likes')

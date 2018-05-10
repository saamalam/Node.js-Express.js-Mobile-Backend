var mongoose = require('mongoose')
var Schema = mongoose.Schema

var messageSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: 'User'},
    to: { type: Schema.Types.ObjectId, ref: 'User'},
    message: String
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('Message', messageSchema, 'messages')

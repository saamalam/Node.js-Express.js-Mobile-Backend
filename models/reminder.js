var mongoose = require('mongoose')
var Schema = mongoose.Schema


var  reminderSchema = new Schema({
    category : { type: Schema.Types.ObjectId, ref: 'Category' },
    days: [{ type: String, enum: ["SUN", "MON", "TUES", "WEDNS", "THURS", "FRI", "SAT"] }],
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
})


module.exports = mongoose.model('Reminder', reminderSchema, 'reminders')
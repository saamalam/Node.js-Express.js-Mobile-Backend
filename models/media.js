var mongoose = require('mongoose')
var Schema = mongoose.Schema


/** 
 * Schema for Media
*/
var mediaSchema = new Schema({
    mediaType: { type: String, enum: ['AUDIO', 'VIDEO', 'IMAGE']},
    url: String
})

module.exports = mongoose.model('Media', mediaSchema, 'medias')

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/** 
 * Schema for Post
*/
var postSchema = new Schema({
	type: {type: String, enum: ['URL', 'AUDIO', 'TEXT', 'VIDEO', 'IMAGE'] ,  required: true },
	title: String,
	category : { type: Schema.Types.ObjectId, ref: 'Category', required: true },
	description: String,
	level: { type: String, enum: ['BASIC', 'MEDIUM', 'ADVANCED'] },
	media: { type: Schema.Types.ObjectId, ref: 'Media', required: false },
	author: { type: Schema.Types.ObjectId, ref: 'User'},
},{
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


module.exports = mongoose.model('Post', postSchema, 'posts');
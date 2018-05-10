var mongoose = require('mongoose')
var Schema = mongoose.Schema

/** 
 * Schema for category
*/
var categorySchema = new Schema({
    names: [{
        language: String,
        translation: String
    }]
});

module.exports = mongoose.model('Category', categorySchema, 'categories')

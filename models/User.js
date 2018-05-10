var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * Schema for socials
 */
var socialSchema = new Schema({
    provider: String,
    id: String
})
socialSchema.index({ provider: 1, id: 1}, { unique: true , sparse: true })

/**
 *  Schema for tokens
 */
var tokensSchema = new Schema({
    accessToken : String,
    expiry: Date
})

/**
 * Schema for users
 */
var userSchema = new Schema({
    name: { type: String },
    email: { type: String, index: true, unique: true, sparse: true},
    phoneNo: { type: String, index: true, unique: true, sparse: true },
    password: String,
    address: String,
    title: String,
    url: String,    
    interests : [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    socials: [socialSchema],
    tokens: [tokensSchema]
});


module.exports = mongoose.model('User', userSchema, 'users')
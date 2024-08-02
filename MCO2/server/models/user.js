const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    profileDescription: {type: String},
    profileImage: {data: Buffer, type: String},
    reservations: []
})

const User = mongoose.model('User', UserSchema)

module.exports = User
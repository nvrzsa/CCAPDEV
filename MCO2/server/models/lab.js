const mongoose = require('mongoose')

const LabSchema = new mongoose.Schema({
    name: {type: String, required: true},
    seats: {type: Number, required: true},
})

const Lab = mongoose.model('Lab', LabSchema)

module.exports = Lab
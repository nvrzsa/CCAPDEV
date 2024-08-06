// { id: 1, userId: 1, labId: 1, date: '2024-06-11', time: '09:00', anonymous: false, seatNumber: 1 },
const mongoose = require('mongoose')

const ReservationSchema = new mongoose.Schema({
    userEmail: {type: String, required: true},
    lab: {type: String, required: true},
    seat: {type: String, required: true},
    date: {type: String, required: true},
    time: {type: String, required: true},
}, {timestamps: true});

const Reservation = mongoose.model('Reservation', ReservationSchema)

module.exports = Reservation
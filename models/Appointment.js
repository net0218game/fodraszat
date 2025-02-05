const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    dateFrom: Date,
    dateTo: Date,
    service: String,
    status: { type: String, default: 'Pending' },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;

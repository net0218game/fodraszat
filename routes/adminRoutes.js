const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Display all appointments
router.get('/', (req, res) => {
    Appointment.find()
        .then(appointments => {
            res.render('admin/index', { title: 'Manage Appointments', appointments });
        })
        .catch(err => res.status(500).send('Error: ' + err));
});

// Change appointment status
router.post('/update', (req, res) => {
    const { appointmentId, status } = req.body;

    Appointment.findByIdAndUpdate(appointmentId, { status })
        .then(() => res.redirect('/admin'))
        .catch(err => res.status(500).send('Error: ' + err));
});

module.exports = router;

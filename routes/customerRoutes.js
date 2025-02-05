const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Display the appointment booking page
router.get('/', (req, res) => {
    res.render('customer/index', { title: 'Book an Appointment' });
});

// Handle the appointment form submission
router.post('/book', (req, res) => {
    const { name, email, phone, dateFrom, dateTo, service } = req.body;
    const newAppointment = new Appointment({ name, email, phone, dateFrom, dateTo, service });

    newAppointment.save()
        .then(() => {
            res.redirect('/customer');
        })
        .catch(err => res.status(500).send('Error: ' + err));
});


module.exports = router;

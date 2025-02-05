const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Fetch all appointments
router.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find({});
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;

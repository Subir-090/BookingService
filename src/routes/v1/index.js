const express = require('express');
const router = express.Router();

const { Booking } = require('../../controllers');

router.post('/bookings',Booking.create);

module.exports = router;
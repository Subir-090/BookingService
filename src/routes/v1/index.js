const express = require('express');
const router = express.Router();

const { Booking } = require('../../controllers');
const { BookingMiddleWare } = require('../../middlewares');

router.post('/bookings',BookingMiddleWare.validateCreateBookingRequest,Booking.create);
router.patch('/bookings/:id',BookingMiddleWare.validateUpdateBookingRequest,Booking.update);

module.exports = router;
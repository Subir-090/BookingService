const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services/index');

const bookingService = new BookingService();

module.exports = {
    async create(req,res) {
        try {
            const response = await bookingService.create(req.body);
            return res.status(StatusCodes.OK).json({
                data: response,
                success: true,
                message: 'Successfully booked the tickets',
                error: {}
            });
        } catch (error) {
            return res.status(error.statusCode).json({
                data: {},
                success: false,
                message: error.explaination,
                error: error.name
            });
        }
    },

    async update(req,res) {
        try {
            const response = await bookingService.update(req.params.id,req.body);
            return res.status(StatusCodes.OK).json({
                data: response,
                success: true,
                message: 'Successfully updated the tickets',
                error: {}
            });
        } catch (error) {
            return res.status(error.statusCode).json({
                data: {},
                success: false,
                message: error.explaination,
                error: error.name
            });
        }
    }

};
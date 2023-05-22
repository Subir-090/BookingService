const { StatusCodes } = require("http-status-codes");

module.exports = {
    validateCreateBookingRequest(req,res,next) {
        if(!req.body.flightId || !req.body.userId || !req.body.noOfSeats) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                data: {},
                success: false,
                message: 'FlightId or userId or noOfSeats was not given',
                error: 'Invalid Request'
            });
        }

        next();
    },
    validateUpdateBookingRequest(req,res,next) {
        if(Object.keys(req.body).length == 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                data: {},
                success: false,
                message: 'No data sent for updation',
                error: 'Invalid Request'
            });
        }

        next();
    }
}
const { Booking } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { AppError, ValidationError } = require('../utils/errors/index');

class BookingRepository {
    async create(data) {
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            if(error.name == 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                'Cannot create booking',
                'There was some issue creating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    async update(id, data) {
        try {
            const booking = await Booking.findByPk(id);

            if(!booking) {
                throw new ValidationError(
                    'Cannot update booking',
                    'No booking found with the given Id',
                    StatusCodes.BAD_REQUEST
                );
            }

            for(let [key,value] of Object.entries(data)) {
                booking[key] = value;
            }
            await booking.save();
            return booking;
        } catch (error) {
            if(error.name == 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                'Cannot create booking',
                'There was some issue creating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    async get(id) {
        try {
            const booking = await Booking.findByPk(id);
            return booking;
        } catch (error) {
            if(error.name == 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                'Cannot create booking',
                'There was some issue creating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
};

module.exports = BookingRepository;
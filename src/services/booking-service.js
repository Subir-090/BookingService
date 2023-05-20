const { ServiceError } = require("../utils/errors");
const axios = require('axios');

const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const { BookingRepository } = require("../repository/index");

class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }
    async create(data) {
        try {
            const flightId = data.flightId;
            const flightGetRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            
            const response = await axios.get(flightGetRequestUrl);
            let flight = response.data.data;
            

            if(data.noOfSeats > flight.AvailableSeats) {
                throw new ServiceError('Something went wrong','Insufficient seats available');
            }
            
            const priceOfFlight = flight.price;
            const totalCost = priceOfFlight * data.noOfSeats;

            const booking = await this.bookingRepository.create({
                flightId,
                userId: data.userId,
                noOfSeats: data.noOfSeats,
                totalCost
            });

            
            const flightUpdatePatchRequest = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            await axios.patch(flightUpdatePatchRequest, {
                AvailableSeats: flight.AvailableSeats - data.noOfSeats
            });

            const finalBooking = await this.bookingRepository.update(booking.id,{
                status: 'Booked'
            });

            return finalBooking;
        } catch (error) {
            if(error.name == 'ValidationError' || error.name == 'RepositoryError') {
                throw error;
            }
            throw new ServiceError();
        }
    }
};

module.exports = BookingService;
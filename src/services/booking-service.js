const { ServiceError, ValidationError } = require("../utils/errors");
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
    async update(bookingId,data) {
        try {
            const oldBooking = await this.bookingRepository.get(bookingId);
            if(!oldBooking) {
                throw new ValidationError(
                    'Cannot update booking',
                    'No booking found with the given Id',
                    StatusCodes.BAD_REQUEST
                );
            }
            
            const flightId = oldBooking.flightId;
            const flightUpdatePatchRequest = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;

            const oldFlightInfo = await axios.get(flightUpdatePatchRequest);
            const result = oldFlightInfo.data.data;

            const flightData = {};
            if(data.noOfSeats) {
                flightData['AvailableSeats'] = result.AvailableSeats + oldBooking.noOfSeats - data.noOfSeats;
                data['totalCost'] = data.noOfSeats * result.price;
            }

            if(data.status) {
                if(data.status == 'Cancelled') {
                    flightData['AvailableSeats'] = result.AvailableSeats + oldBooking.noOfSeats;
                    data['totalCost'] = 0;
                }                 
            }

            const updatedBooking = await this.bookingRepository.update(bookingId,data);
            const updateFlight = await axios.patch(flightUpdatePatchRequest, flightData);

            return updatedBooking;
        } catch (error) {
            if(error.name == 'ValidationError' || error.name == 'RepositoryError') {
                throw error;
            }
            throw new ServiceError();
        }
    }
};

module.exports = BookingService;
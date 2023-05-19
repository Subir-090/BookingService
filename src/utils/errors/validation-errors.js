const { StatusCodes } = require('http-status-codes');

class ValidationError extends Error {
    constructor(error) {
        super();
        this.message = 'Not able to validate the data sent in request';
        let explaination = "";

        for(const err of error) {
            explaination.push(err.message);
        }

        this.explaination = explaination;
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = ValidationError;
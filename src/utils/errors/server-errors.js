const { StatusCodes } = require("http-status-codes");

class ServerError extends Error {
    constructor(
        message,
        explaination,
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super();
        this.message = message;
        this.explaination = explaination;
        this.statusCode = statusCode;
    }
}

module.exports = ServerError;
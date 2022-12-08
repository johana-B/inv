const { StatusCodes } = require('http-status-codes');
const CustomError = require('./customError');

class unauthenticatedError extends CustomError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
};

module.exports = unauthenticatedError
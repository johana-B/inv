const CustomApiError = require('./customError');
const BadRequestError = require('./badRequestError');
const NotFoundError = require('./badRequestError');
const unauthenticatedError = require('./unauthenticated');

module.exports = {
    CustomApiError,
    BadRequestError,
    NotFoundError,
    unauthenticatedError
}
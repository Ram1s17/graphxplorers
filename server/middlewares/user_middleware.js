const ApiError = require('../exceptions/api_error');

module.exports = function (req, res, next) {
    try {
        if (req.user.role !== 'USER') {
            return next(ApiError.ForbiddenError());
        }
        next();
    }
    catch (e) {
        return next(ApiError.ForbiddenError());
    }
}
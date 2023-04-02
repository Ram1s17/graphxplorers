module.exports = class ApiError extends Error {
    status;

    constructor(status, message) {
        super(message);
        this.status = status;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован!');
    }

    static ForbiddenError() {
        return new ApiError(403, 'Отказано в доступе!');
    }

    static BadRequest(message) {
        return new ApiError(400, message);
    }
}
class ApiError {
    constructor(code, msg, errors) {
        this.code = code
        this.msg = msg
        this.errors = errors
    }

    static authenticationError(msg = '', errors = {}) {
        return new ApiError(401, msg, errors)
    }

    static authorizationError(msg = '', errors = {}) {
        return new ApiError(403, msg, errors)
    }

    static badRequest(msg = '', errors = {}) {
        return new ApiError(400, msg, errors)
    }

    static internal(msg = '', errors = {}) {
        return new ApiError(500, msg, errors)
    }

    static unProcessableEntity(msg = '', errors = {}) {
        return new ApiError(422, msg, errors)
    }

    static methodNotAllowed(msg = '', errors = {}) {
        return new ApiError(405, msg, errors)
    }

    static validationFailure(msg = '', errors = {}) {
        return new ApiError(200, msg, errors)
    }
}

module.exports = ApiError

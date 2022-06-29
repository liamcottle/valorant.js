class APIError extends Error {

    constructor(message) {
        super(message);
    }

}

module.exports = APIError;

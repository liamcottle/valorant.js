const APIError = require("./APIError");

class AuthFailureError extends APIError {

    constructor() {
        super("Username or password is incorrect.");
    }

}

module.exports = AuthFailureError;

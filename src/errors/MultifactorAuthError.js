const APIError = require("./APIError");

class MultifactorAuthError extends APIError {

    constructor(message, multifactor) {
        super(message);
        this.multifactor = multifactor;
    }

}

module.exports = MultifactorAuthError;

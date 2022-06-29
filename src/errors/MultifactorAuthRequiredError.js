const MultifactorAuthError = require("./MultifactorAuthError");

class MultifactorAuthRequiredError extends MultifactorAuthError {

    constructor(multifactor) {
        super("Multifactor code is required to continue.", multifactor);
    }

}

module.exports = MultifactorAuthRequiredError;

const MultifactorAuthError = require("./MultifactorAuthError");

class MultifactorAuthAttemptFailedError extends MultifactorAuthError {

    constructor(multifactor) {
        super("Multifactor code is incorrect. Try again.", multifactor);
    }

}

module.exports = MultifactorAuthAttemptFailedError;

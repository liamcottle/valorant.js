"use strict";

module.exports = {
  APIError: require("./errors/APIError"),
  AuthFailureError: require("./errors/AuthFailureError"),
  MultifactorAuthError: require("./errors/MultifactorAuthError"),
  MultifactorAuthRequiredError: require("./errors/MultifactorAuthRequiredError"),
  MultifactorAuthAttemptFailedError: require("./errors/MultifactorAuthAttemptFailedError"),
};

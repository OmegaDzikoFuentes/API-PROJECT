const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware

const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = "Invalid credentials"); //changed for testing added "invalid credentials"

    const err = Error("Bad Request");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad Request";
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors
};

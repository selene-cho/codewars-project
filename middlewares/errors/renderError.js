exports.renderSignupError = (statusCode, errorField, message) => {
  return (req, res, next) => {
    const errorObject = {};

    errorObject[errorField] = message;

    return res.status(statusCode).render("auth/signup", {
      error: errorObject,
    });
  }
}

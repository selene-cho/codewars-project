const passport = require("passport");
const User = require("../models/User");
const errorHandling = require("../middlewares/errors/errorHandling");
const { renderSignupError } = require("../middlewares/errors/renderError");
const ERRORS = require("./messages");

exports.renderLoginPage = async (req, res, next) => {
  try {
    res.render("auth/login", { error: req.flash("error") });
  } catch (err) {
    next(err);
  }
}

exports.login = async (req, res, next) => {
  passport.authenticate(
    "local",
    { badRequestMessage: ERRORS.AUTH.NEED_ID_PW, },
    (err, user, info) => {
      if (err) {
        return next(
          new errorHandling(ERRORS.AUTH.LOGIN_PROCESS, 500)
        );
      }

      if (!user) {
        req.flash("error", info.message);

        return res.status(303).redirect("/login");
      }

      req.login(user, (err) => {
        if (err) {
          return next(
            new errorHandling(ERRORS.AUTH.LOGIN_PROCESS, 500)
          );
        }

        return res.status(303).redirect("/");
      });
    }
  )(req, res, next);
}

exports.logout = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res
      .status(400)
      .render("error", { message: ERRORS.AUTH.NOT_AUTHENTICATED });
  }

  req.logout((err) => {
    if (err) {
      return next(new errorHandling(ERRORS.AUTH.LOGOUT, 500));
    }

    res.status(303).redirect("/");
  });
}

exports.renderSignupPage = async (req, res, next) => {
  try {
    res
      .status(400)
      .render("auth/signup", { error: req.flash("error") });
  } catch (err) {
    next(err);
  }
}

exports.signup = async (req, res, next) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return renderSignupError(400, "general", ERRORS.AUTH.NEED_ID_PW)(req, res, next);
    }

    const isUserExist = await User.findOne({ id });

    if (isUserExist) {
      return renderSignupError(400, "id", ERRORS.AUTH.EXISTING_ID)(req, res, next);
    }

    const user = new User({ id, password });

    await validateUserAsync(user);

    await user.save();

    req.login(user, (err) => {
      if (err) return next(err);

      return res.status(303).redirect("/");
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = {};

      for (const field in err.errors) {
        messages[field] = err.errors[field].message;
      }

      return res
        .status(400)
        .render("auth/signup", { error: messages });
    }
    return next(new errorHandling(ERRORS.AUTH.SIGNUP_PROCESS, 500));
  }
}

async function validateUserAsync(user) {
  try {
    await user.validateAsync();
  } catch (validationError) {
    const errorMessages = {};

    for (const filed in validationError.errors) {
      errorMessages[filed] = validationError.errors[filed].message;
    }

    throw errorMessages;
  }
}

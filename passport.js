const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: "id",
    passwordField: "password",
    session: true,
    passReqToCallback : false,
  }, async (id, password, done) => {
    try {
      const user = await User.findOne({ id });

      if (!user) {
        return done(null, false, {
          message: "아이디 또는 비밀번호를 잘못 입력하셨습니다."
        });
      }

      const isMatched = await user.comparePassword(password);

      if (!isMatched) {
        return done(null, false, {
          message: "아이디 또는 비밀번호를 잘못 입력하셨습니다."
        });
      }

      return done(null, user);
    } catch (err) {
      done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ id });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

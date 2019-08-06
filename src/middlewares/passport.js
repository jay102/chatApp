const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

function mPassport(User, passport) {

    function passportSerialize() {
        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function (id, done) {
            User.findByPk(id).then(user => {
                done(null, user);
            });
        });
    }

    function passportStrategy() {
        passport.use(
            new LocalStrategy(
                {
                    usernameField: "email"
                },
                function (email, password, done) {
                    User.findOne({ where: { email: email } })
                        .then(user => {
                            if (!user) {
                                return done(null, false, { message: "Incorrect email." });
                            }
                            bcrypt.compare(password, user.password, function (err, res) {
                                if (!res) {
                                    return done(null, false, { message: "Incorrect password" });
                                } else {
                                    return done(null, user);
                                }
                            });
                        })
                        .catch(err => {
                            if (err) {
                                return done(err);
                            }
                        });
                }
            )
        );
    }

    return {
        passportSerialize,
        passportStrategy
    }


}
module.exports = mPassport;


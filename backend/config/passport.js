const passport = require('passport');
const facebookTokenStrategy = require('passport-facebook-token');
var User = require('../models/user');
module.exports = function () {
    passport.use('facebookToken', new facebookTokenStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await User.findOne({ 'userid': profile.id });

            if (existingUser) {
                return done(null, existingUser);
            }

            const newUser = new User({
                userid: profile.id,
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                email: profile.email,
                token: accessToken
            });

            await newUser.save();
            done(null, newUser);

        } catch (error) {
            done(error, false);
        }
    }));
};

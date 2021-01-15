const passport = require('passport');
const LocalStategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('../config/config');

const User = require('../models/user');

exports.local = passport.use(new LocalStategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = user => {

    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });

};

let opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwtPayload, done) => {

    console.log(`JWT Payload: ${jwtPayload}`);

    User.findOne({ _id: jwtPayload._id }, (err, user) => {

        if (err) return done(err, false);
        
        else if (user) return done(null, user);

        else return done(null, false);

    });

}));

exports.verifyUser = passport.authenticate('jwt', { session: false });
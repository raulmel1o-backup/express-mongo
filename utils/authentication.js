const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const FacebookTokenStrategy = require('passport-facebook-token');

const config = require('../config/config');

const User = require('../models/users');
const Dishes = require('../models/dishes');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

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

exports.verifyAdmin =  (req, res, next) => {

    if (!req.user) {

        // const err = new Error('You are not authorized to perform this operation!');
        const err = new Error('You are not logged in!');
        err.status = 403;

        return next(err);

    } else {

        if (!req.user.admin) {

            const err = new Error('You are not authorized to perform this operation!');
            err.status = 403;

            return next(err);

        } else {

            return next();

        }

    }

}

exports.verifyId = (req, res, next) => {

    if (!req.user) {

        // const err = new Error('You are not authorized to perform this operation!');
        const err = new Error('You are not logged in!');
        err.status = 403;

        return next(err);

    } else {

        Dishes.findById(req.params.dishId)

        .then(dish => {

            if (!dish) {

                const err = new Error('Dish not found!');
                err.status = 404;

                return next(err);

            } else if (!dish.comments.id(req.params.commentId)) {

                const err = new Error('Comment not found!');
                err.status = 404;

                return next(err);

            } else if (!dish.comments.id(req.params.commentId).author.equals(req.user._id)) {

                const err = new Error('You are not authorized to perform this operation!');
                err.status = 403;

                return next(err);

            } else {

                return next();
            }

        })

        .catch(err => next(err));

    }
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret,
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) return done(err, false);
        if (!err && user) return done(null, user);
        else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstName = profile.name.givenName;
            user.lastName = profile.name.familyName;

            user.save((err, user) => {
                if (err) return done(err, false);
                else return done(null, user);
            });
        }
    });
}));
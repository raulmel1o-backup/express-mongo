const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const authenticate = require('../utils/authentication');

const User = require('../models/users');

const userRouter = express.Router();

/* GET users listing. */
userRouter.get('/', async function(req, res, next) {
  
  const users = await User.find({});

  res.json(users);

});

userRouter.use(bodyParser.json());

userRouter.post('/signup', (req, res, next) => {
  
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {

    if (err) {

      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');

      res.json({ err: err });

    } else {

      if (req.body.firstname) user.firstname = req.body.firstname;
      if (req.body.lastname) user.lastname = req.body.lastname;

      user.save((err, user) => {

        if (err) {

          res.setHeader(' Content-Type', 'application/json');
          res.status(500).json({ err });
          return;

        }

        passport.authenticate('local')(req, res, () => {
      
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
        
          res.json({ success: true, status: 'Registration Successful!' });
  
        });
        
      });

    }

  });

});

userRouter.get('/login', (req, res, next) => {

  res.render('login');

});

userRouter.post('/login', passport.authenticate('local'), (req, res) => {

  const token = authenticate.getToken({ _id: req.user._id });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  res.json({ success: true, token, status: 'You are successfully logged in!' });

});

module.exports = userRouter;
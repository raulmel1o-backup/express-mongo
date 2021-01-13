const express = require('express');
const bodyParser = require('body-parser');

const User = require('../models/user');

const userRouter = express.Router();

/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

userRouter.use(bodyParser.json());

userRouter.post('/signup', (req, res, next) => {
  
  User.findOne({username: req.body.username})
  
  .then((user) => {
  
    if(user != null) {

      const err = new Error('User ' + req.body.username + ' already exists!');
      err.status = 403;

      next(err);

    } else {

      return User.create({

        username: req.body.username,
        password: req.body.password

      });

    }

  })

  .then((user) => {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful!', user: user});

  }, (err) => next(err))

  .catch((err) => next(err));

});

userRouter.post('/login', (req, res, next) => {

  if(!req.session.user) {
  
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {

      const err = new Error('You are not authenticated!');
      err.status = 401;
      
      res.setHeader('WWW-Authenticate', 'Basic');
      
      return next(err);

    }
  
    const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const username = auth[0];
    const password = auth[1];
  
    User.findOne({ username: username })
    
    .then((user) => {
    
      if (user === null) {
    
        const err = new Error('User ' + username + ' does not exist!');
        err.status = 403;

        return next(err);

      } else if (user.password !== password) {
        
        const err = new Error('Your password is incorrect!');
        err.status = 403;
        
        return next(err);

      } else if (user.username === username && user.password === password) {

        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!');

      }

    })
    
    .catch((err) => next(err));

  } else {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');

  }

});

userRouter.get('/logout', (req, res) => {
  
  if (req.session) {
  
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');

  } else {

    const err = new Error('You are not logged in!');
    err.status = 403;
    
    next(err);

  }

});

module.exports = userRouter;
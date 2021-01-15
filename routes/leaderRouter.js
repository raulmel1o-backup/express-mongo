const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../utils/authentication');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

.get((req,res,next) => {
    
    Leaders.find({})

    .then(leaders => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(leaders);

    }, err => next(err))

    .catch(err => next(err));

})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    
    Leaders.create(req.body)

    .then(leader => {

        console.log(leader);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(leader);

    }, err => next(err))

    .catch(err => next(err));

})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    
    res.statusCode = 403;
    res.end(`PUT operation not supported on /leaders`);

})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

    Leaders.remove({})

    .then(response => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response);

    }, err => next(err))

    .catch(err => next(err));

});

leaderRouter.route('/:leaderId')

.get((req,res,next) => {
    
    Leaders.findById(req.params.leaderId)

    .then(leader => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(leader);

    }, err => next(err))

    .catch(err => next(err));

})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    
    res.statusCode = 403;
    res.end(`POST operation not supported on /Leaders/${req.params.leaderId}`);

})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body,
    }, { new: true })

    .then(leader => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(leader);

    }, err => next(err))

    .catch(err => next(err));

})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    
    Dishes.findByIdAndRemove(req.params.leaderId)

    .then(response => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response);

    }, err => next(err))

    .catch(err => next(err));

});

module.exports = leaderRouter;
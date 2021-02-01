const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../utils/authentication');
const cors = require('./cors');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')

.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors, (req,res,next) => {
    
    Promotions.find({})

    .then(promotions => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(promotions);

    }, err => next(err))

    .catch(err => next(err));

})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    
    Promotions.create(req.body)

    .then(promotion => {

        console.log(promotion);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(promotion);

    }, err => next(err))

    .catch(err => next(err));

})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    
    res.statusCode = 403;
    res.end(`PUT operation not supported on /promotions`);

})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

    Promotions.remove({})

    .then(response => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response);

    }, err => next(err))

    .catch(err => next(err));

});

promoRouter.route('/:promoId')

.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors, (req,res,next) => {
    
    Promotions.findById(req.params.promoId)

    .then(promotion => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(promotion);

    }, err => next(err))

    .catch(err => next(err));

})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.leaderId}`);

})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body,
    }, { new: true })

    .then(promotion => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(promotion);

    }, err => next(err))

    .catch(err => next(err));

})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    
    Dishes.findByIdAndRemove(req.params.promoId)

    .then(response => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response);

    }, err => next(err))

    .catch(err => next(err));

});

module.exports = promoRouter;
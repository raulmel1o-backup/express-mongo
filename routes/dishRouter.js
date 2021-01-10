const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')

.get((req,res,next) => {
    
    Dishes.find({})
        
    .then(dishes => {
    
        res.setHeader('Contente-Type', 'application/json');
        res.status(200).json(dishes);

    }, err => next(err))

    .catch(err => next(err));

})

.post((req, res, next) => {
    
    Dishes.create(req.body)

    .then(dish => {
    
        console.log(dish);
        res.setHeader('Contente-Type', 'application/json');
        res.status(200).json(dish);
    
    }, err => next(err))
    
    .catch(err => next(err))

})

.put((req, res, next) => {

    res.statusCode = 403;
    res.end(`PUT operation not supported on /dishes`);
    
})

.delete((req, res, next) => {

    Dishes.remove({})

    .then(response => {

        res.setHeader('Contente-Type', 'application/json');
        res.status(200).json(response);

    }, err => next(err))

    .catch(err => next(err))

});

dishRouter.route('/:dishId')

.get((req,res,next) => {
    
    Dishes.findById(req.params.dishId)
    
    .then(dish => {
        
        res.setHeader('Contente-Type', 'application/json');
        res.status(200).json(dish);

    }, err => next(err))

    .catch(err => next(err));

})

.post((req, res, next) => {
    
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`);

})

.put((req, res, next) => {

    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body,
    }, { new: true })
    
    .then(dish => {

        res.setHeader('Contente-Type', 'application/json');
        res.status(200).json(dish);

    }, err => next(err))

    .catch(err => next(err))

})

.delete((req, res, next) => {

    Dishes.findByIdAndRemove(req.params.dishId)

    .then(response => {

        res.setHeader('Contente-Type', 'application/json');
        res.status(200).json(response);

    }, err => next(err))

    .catch(err => next(err))

});

module.exports = dishRouter;
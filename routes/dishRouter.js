const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../utils/authentication');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')

.get((req,res,next) => {
    
    Dishes.find({})

    .populate('comments.author')
        
    .then(dishes => {
    
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(dishes);

    }, err => next(err))

    .catch(err => next(err));

})

.post(authenticate.verifyUser, (req, res, next) => {
    
    Dishes.create(req.body)

    .then(dish => {
    
        console.log(dish);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(dish);
    
    }, err => next(err))
    
    .catch(err => next(err));

})

.put(authenticate.verifyUser, (req, res, next) => {

    res.statusCode = 403;
    res.end(`PUT operation not supported on /dishes`);
    
})

.delete(authenticate.verifyUser, (req, res, next) => {

    Dishes.remove({})

    .then(response => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response);

    }, err => next(err))

    .catch(err => next(err));

});

dishRouter.route('/:dishId')

.get((req,res,next) => {
    
    Dishes.findById(req.params.dishId)

    .populate('comments.author')
    
    .then(dish => {
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(dish);

    }, err => next(err))

    .catch(err => next(err));

})

.post(authenticate.verifyUser, (req, res, next) => {
    
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`);

})

.put(authenticate.verifyUser, (req, res, next) => {

    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body,
    }, { new: true })
    
    .then(dish => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(dish);

    }, err => next(err))

    .catch(err => next(err));

})

.delete(authenticate.verifyUser, (req, res, next) => {

    Dishes.findByIdAndRemove(req.params.dishId)

    .then(response => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response);

    }, err => next(err))

    .catch(err => next(err));

});

dishRouter.route('/:dishId/comments')

.get((req, res, next) => {

    Dishes.findById(req.params.dishId)

    .populate('comments.author')

    .then(dish => {

        if (dish) {

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(dish.comments);

        } else {

            err = new Error(`Dish ${req.params.dishId} not found`);
            err.status(404);
            
            return next(err);

        }
    }, err => next(err))

    .catch(err => next(err));

})

.post(authenticate.verifyUser, (req, res, next) => {

    Dishes.findById(req.params.dishId)

    .then(dish => {

        if (dish) {

            req.body.author = req.user._id;

            dish.comments.push(req.body);
            dish.save()
            
            .then(dish => {

                Dishes.findById(dish_id)
                
                .populate('comments.author')
                
                .then(dish => {

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(dish);

                });

            }, err => next(err))

        } else {

            err = new Error(`Dish ${req.params.dishId} not found`);
            err.status(404);

            return next(err);

        }

    }, err => next(err))

    .catch(err => next(err));

})

.put(authenticate.verifyUser, (req, res, next) => {

    res.statusCode = 403;
    res.end(`PUT operation not supported on /dishes/${req.params.dishId}/comments`);

})

.delete(authenticate.verifyUser, (req, res, next) => {

    Dishes.findById(req.params.dishId)

    .then(dish => {

        if (dish) {

            for (let i = dish.comments.length - 1; i >= 0; i--) {

                dish.comments.id(dish.comments[i]._id).remove();

            }

            dish.save()

            .then(dish => {

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(dish);

            }, err => next(err));

        } else {

            err = new Error(`Dish ${req.params.dishId} not found`);
            err.status(200);
         
            return next(err);

        }

    }, err => next(err))

    .catch(err => next(err));

})

dishRouter.route('/:dishId/comments/:commentId')

.get((req,res,next) => {

    Dishes.findById(req.params.dishId)

    .populate('comments.author')

    .then((dish) => {

        if (dish && dish.comments.id(req.params.commentId)) {

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(dish.comments.id(req.params.commentId));

        } else if (dish == null) {

            err = new Error(`Dish ${req.params.dishId} not found`);
            err.status = 404;

            return next(err);
            
        } else {
            
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            
            return next(err);

        }

    }, (err) => next(err))

    .catch((err) => next(err));

})

.post(authenticate.verifyUser,(req, res, next) => {

    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/${req.params.dishId}/comments/${req.params.commentId}`);

})

.put(authenticate.verifyUser, (req, res, next) => {

    Dishes.findById(req.params.dishId)

    .then((dish) => {

        if (dish && dish.comments.id(req.params.commentId)) {

            if (req.body.rating) {

                dish.comments.id(req.params.commentId).rating = req.body.rating;

            }

            if (req.body.comment) {

                dish.comments.id(req.params.commentId).comment = req.body.comment;

            }

            dish.save()

            .then((dish) => {

                Dishes.findById(dish_id)

                .populate('comments.author')

                .then(dish => {

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(dish);

                });

            }, (err) => next(err));

        } else if (dish == null) {

            err = new Error(`Dish ${req.params.dishId} not found`);
            err.status = 404;
            
            return next(err);

        } else {

            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            
            return next(err);

        }

    }, (err) => next(err))

    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, (req, res, next) => {

    Dishes.findById(req.params.dishId)

    .then((dish) => {

        if (dish && dish.comments.id(req.params.commentId)) {

            dish.comments.id(req.params.commentId).remove();
            
            dish.save()
            
            .then((dish) => {
            
                Dishes.findById(dish_id)

                .populate('comments.author')

                .then(dish => {

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(dish);

                });

            }, (err) => next(err));

        } else if (dish == null) {

            err = new Error(`Dish ${req.params.dishId} not found`);
            err.status = 404;
            
            return next(err);

        } else {

            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            
            return next(err);

        }

    }, (err) => next(err))

    .catch((err) => next(err));

});

module.exports = dishRouter;
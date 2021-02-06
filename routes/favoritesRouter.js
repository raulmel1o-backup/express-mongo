const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../utils/authentication');
const cors = require('./cors');

const Favorites = require('../models/dishes');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')

.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(authenticate.verifyUser, (req,res,next)=>{
    
    Favorite.find({})

    .populate('users')

    .populate('favoriteDishes')

    .then(favorites => {
        
        if (favorites) {

            const userFavorites = favorites.filter(fav => fav.users._id.toString() === req.user.id.toString())[0];

            if (!userFavorites) {
                const err = new Error('You have no favorites!');
                err.status = 404;

                return next(err);

            }

            res.setHeader("Content-Type", "application/json");
            res.status(200).json(userFavorites);

        } else {

            const err = new Error('There are no favorites');
            err.status = 404;

            return next(err);

        }
        
    }, err => next(err))

    .catch(err => next(err));

})

.post(authenticate.verifyUser, (req,res,next)=>{
    
    Favorite.find({})

    .populate('users')
    .populate('favoriteDishes')
        
    .then(favorites => {
    let user;
        
        if (favorites) user = favorites.filter(fav => fav.users._id.toString() === req.user.id.toString())[0];
        if (!user) user = new Favorite({ users: req.user.id });

        for (let i of req.body) {
                
            if (user.favoriteDishes.find((dish_id) => {
                    if(dish_id._id) return dish_id._id.toString() === i._id.toString();
            }))
                    continue;
                user.favoriteDishes.push(i._id);
        }
        
        user.save()
        
        .then((userFavorites) => {
                    
            res.setHeader("Content-Type", "application/json");
            res.json(userFavorites);
            
            console.log("Favorites Created");
        }, err => next(err))
        
        .catch(err => next(err));
            
    })

    .catch(err => next(err));

})

.put(authenticate.verifyUser, (req,res,next)=>{
    
    res.statusCode = 403;
    res.setHeader('Content-Type','text/plain');
    res.end('PUT operation is not supported on /favorites');

})

.delete(authenticate.verifyUser, (req,res,next)=>{
    
    Favorite.find({})
    
    .then(favorites => {

        let favToRemoved;

        if (favorites) {

            removeFavorite = favorites.filter(fav => fav.users._id.toString() === req.user.id.toString())[0];

            if (removeFavorite) {

                removeFavorite.remove()

                .then(result => {

                    res.setHeader("Content-Type", "application/json");
                    res.status(200).json(result);

                }, err => next(err));

            } else {

            const err = new Error('You do not have any favorites');
            err.status = 404;

            return next(err);

            }

        } else {

            const err = new Error("No favorites to delete")

            return next();

        }

    }, err => next(err))
    
    .catch((err)=>next(err));

});

favoriteRouter.route('/:dishId')

.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(authenticate.verifyUser, (req, res, next) => {
    
    Favorite.find({})
    
    .populate('users')
    
    .populate('favoriteDishes')
    
    .then(favorites => {

        if (favorites) {

            const favs = favorites.filter(fav => fav.users._id.toString() === req.user._id.toString())[0];

            const dish = favs.favoriteDishes.filter(dish => dish._id.toString() === req.params.dishId.toString())[0];

            if (dish) {

                res.setHeader("Content-Type", "application/json");
                res.status(200).json(dish);

            } else {
                
                const err = new Error('You do not have dish ' + req.params.dishId);
                err.status = 404;
        
                return next(err);

            }

        } else {

            const err = new Error('You do not have any favorites');
            err.status = 404;
            
            return next(err);

        }
    }, err => next(err))

    .catch((err) => next(err));

})

.post(authenticate.verifyUser, (req, res, next) => {
    
    Favorite.find({})

    .populate('users')

    .populate('favoriteDishes')

    .then((favorites)=>{
        const user = favorites.filter(fav => fav.users._id.toString() === req.user._id.toString())[0];

        if (!user) user = new Favorite({users: req.user._id});

        if (!user.favoriteDishes.find((dish_id) => { if(dish_id._id) return dish_id._id.toString() === req.params.dishId.toString(); }))
            user.favoriteDishes.push(req.params.dishId);

        user.save()

        .then(userFavorites => {

            res.setHeader("Content-Type", "application/json");
            res.status(201).json(userFavorites);

            console.log("Favorites Created");

        }, err => next(err))

        .catch((err) => next(err));

    })

    .catch((err) => next(err));
        
})

.put(authenticate.verifyUser, (req, res, next) => {
    
    res.statusCode = 403;
    res.setHeader('Content-Type','text/plain');
    res.end('PUT operation is not supported on /favorites');

})

.delete(authenticate.verifyUser, (req, res, next) => {

    Favorite.find({})
    
    .populate('users')
    
    .populate('favoriteDishes')

    .then(favorites => {
        
        if (favorites) {
            const user = favorites.filter(fav => fav.users._id.toString() === req.user._id.toString())[0];

            if (!user) {

                const err = new Error("You have no favorites");
                res.statusCode = 404;

                return next(err);

            } else {
                
                user.favoriteDishes = user.favoriteDishes.filter(dishId => dishId._id.toString() !== req.params.dishId);

                user.save()

                .then(result => {

                    res.setHeader("Content-Type", "application/json");
                    res.status(200).json(result);

                    }, err => next(err));
            }

        }

    }, err => next(err))

    .catch(err => next(err));

});

module.exports = favoriteRouter;
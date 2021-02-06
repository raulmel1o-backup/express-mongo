const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    favoriteDishes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
    }
});

const Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;
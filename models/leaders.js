const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

const leadersSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    abbr: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },

}, {
    
    timestamps: true
    
});

module.exports = mongoose.model('Leaders', leadersSchema);
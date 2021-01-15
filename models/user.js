const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
    admin: {
        type: Boolean,
        default: false,
    }

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
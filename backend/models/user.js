
/* const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    method: {
        type: String,
        enum: ['facebook'],
        required: true
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String
        },
        token: {
            type: String
        },
        select: false
    }
});


var User = mongoose.model('User', userSchema);

module.exports.User = User; */


var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    userid: String,
    first_name: String,
    last_name: String,
    email: String,
    token: String,
    updated_at: { type: Date, default: Date.now },
});

//UserSchema.statics.findOrCreate = require("find-or-create");

module.exports = mongoose.model('User', UserSchema);

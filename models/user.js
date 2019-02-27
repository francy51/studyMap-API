var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    local: {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    description: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);

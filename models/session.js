var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sessionSchema = Schema({
    subject: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    creationdate: Date,
    startdate: Date,
    location: {
        lng: Number,
        lat: Number
    },
    isended: Boolean,
    attendee: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
        
    }]
});

module.exports = mongoose.model('Session', sessionSchema);

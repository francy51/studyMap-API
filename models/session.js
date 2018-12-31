var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sessionSchema = Schema({
    subject: String,
    creatorid: Schema.Types.ObjectId,
    creationdate: Date,
    startdate: Date,
    location: {
        lng: Number,
        lat: Number
    },
    isended: Boolean,
    attendee: [{
        _attendeeId: Schema.Types.ObjectId,
        name: String
    }]
});

module.exports = mongoose.model('Session', sessionSchema);

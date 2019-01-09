var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var queCardsSchema = Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cards: [{
        type: Schema.Types.Mixed
    }],
    isPrivate: Boolean,
    //This array is populated only if isPrivate is set to true
    sharedTo: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('QueCards', queCardsSchema);

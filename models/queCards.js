var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var queCardsSchema = Schema({
    Cards: [{
        type: Schema.Types.Mixed
    }]
});

module.exports = mongoose.model('QueCards', queCardsSchema);

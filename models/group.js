var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Session = require("./session")

var groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    //The implementation should workd hopefully
    //Reference this to user once uder model created
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    creationDate: {
        type: Date,
        required: true
    },
    //Whether this group can be found publicly
    isPrivate: {
        type: Boolean,
        required: true
    },
    //Whether this group will accept new people or is closed
    isClosed:{
        type: Boolean,
        required: true
    },
    sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
    people: [{
        //Add reference parameter when user data is found
        _personId: { type: Schema.Types.ObjectId, ref: 'User' }
    }]
});

module.exports = mongoose.model('Group', groupSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Session = require("./session")

var groupSchema = new Schema({
    name: String,
    _creatorId: Schema.Types.ObjectId,
    creationdate: Date,
    //Whether this group can be found publicly
    isPrivate: Boolean,
    //Whether this group will accept new people or is closed
    isClosed: Boolean,
    sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
    people: [{
        //Add reference parameter when user data is found
        _personId: { type: Schema.Types.ObjectId }
    }]
});

module.exports = mongoose.model('Group', groupSchema);

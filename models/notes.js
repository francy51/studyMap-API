var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notesSchema = Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: [{
        type: Schema.Types.mixed
    }],
    cards: {
        type: Schema.Types.ObjectId,
        ref: 'QueCards'
    },
    isPrivate: Boolean,
    //This array is populated only if isPrivate is set to true
    //People in the sharedTo array can only see the notes
    sharedTo: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    //The collaborators array includes people who can change the notes
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Notes', notesSchema);

var Group = require("../.././models/group")
var User = require("../.././models/user")
var Session = require("../.././models/session")
var mongoose = require('mongoose')
var { transformGroup, transformSession } = require("../helpers/index")


module.exports = {
    getGroupSessions: async(args, req) => {
        try {
            //Get the group
            //then return each session in it
            let group = await Group.findById(args.id).populate('Session');
            console.log(group)
            return transformGroup(group).sessions;
        }
        catch (err) {
            throw err;
        }
    },
    getGroupSession: async(args, req) => {
        try {
            //Get session using its id
            let session = await Session.findById(args.id).populate('Session');
            console.log(session)
            return transformSession(session).sessions;
        }
        catch (err) {
            throw err;
        }
    },
}

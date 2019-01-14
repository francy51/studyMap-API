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
            let session = await Session.findById(args.id);
            console.log(session)
            return transformSession(session);
        }
        catch (err) {
            throw err;
        }
    },
    createSessions: async(args, req) => {
        try {
            //Add this back in once I'm no longer testing the api
            // if (!req.isAuh) {
            //     throw new Error("Log in")
            // }
            let session = new Session({
                subject: args.sessionInput.subject,
                creator: args.sessionInput.creator,
                creationdate: Date(args.sessionInput.creationdate),
                startdate: Date(args.sessionInput.startdate),
                location: {
                    lng: args.sessionInput.lng,
                    lat: args.sessionInput.lat
                },
                isended: false,
                maxPeople: args.sessionInput.maxPeople,
                parentGroup: args.sessionInput.parentGroup
            });
            let response = await session.save();
            return transformSession(response);
        }
        catch (err) {
            throw err;
        }
    }
}

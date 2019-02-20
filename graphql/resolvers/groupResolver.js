var Group = require("../.././models/group")
var User = require("../.././models/user")
var mongoose = require('mongoose')

var { transformGroup } = require("../helpers/index")


module.exports = {
    groups: async(args, req) => {
        try {
            // if (!req.isAuth) {
            //     throw new Error("Log in")
            // }
            let groups = await Group.find().skip(10*(args.page -1)).sort({'date': -1}).limit(10);
            return groups.map(group => transformGroup(group))
        }
        catch (err) {
            throw err
        }
    },
    createGroup: async(args, req) => {
        try {
            if (!req.isAuh) {
                throw new Error("Log in")
            }
            let group = new Group({
                name: args.groupInput.name,
                //Change this to req.userId later
                creator: args.groupInput.creatorId,
                creationDate: new Date(),
                isPrivate: args.groupInput.isPrivate,
                isClosed: false
            });
            let response = await group.save();
            return transformGroup(response);
        }
        catch (err) {
            throw err;
        }
    },
    findGroup: async(args, req) => {
        try {
            if (!req.isAuh) {
                throw new Error("Log in")
            }
            let group = await Group.findById(args.id);
            return transformGroup(group);
        }
        catch (err) {
            throw err;
        }
    }
}

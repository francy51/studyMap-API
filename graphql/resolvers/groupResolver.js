var Group = require("../.././models/group")
var User = require("../.././models/user")
var mongoose = require('mongoose')

var { transformGroup } = require("../helpers/index")


module.exports = {
    groups: async(args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error("Log in")
            }
            //Need to make it so that if a group is private but you are part of the people in the group you can see it
            let groups = await Group.find({
                $or: [{ isPrivate: false }, { creator: req.userId }]
            }).skip(10 * (args.page - 1)).sort({ 'date': -1 }).limit(10);
            return groups.map(group => transformGroup(group))
        }
        catch (err) {
            throw err
        }
    },
    myGroups: async(args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error("Log in")
            }
            //Need to make it so that if a group is private but you are part of the people in the group you can see it
            let groups = await Group.find({
                creator: req.userId
            }).skip(10 * (args.page - 1)).sort({ 'date': -1 }).limit(10);
            return groups.map(group => transformGroup(group))
        }
        catch (err) {
            throw err
        }
    },
    createGroup: async(args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error("Log in")
            }
            let group = new Group({
                name: args.groupInput.name,
                description: args.groupInput.description,
                //Change this to req.userId later
                creator: req.userId,
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

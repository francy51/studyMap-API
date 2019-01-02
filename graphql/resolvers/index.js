var Group = require("../.././models/group")
var User = require("../.././models/user")
var mongoose = require('mongoose')
var bcrypt = require("bcrypt")
var JWT = require("jsonwebtoken")

//For development 
const userID = '5c2cde15a6dd2e15e92016d6'

const singleUser = async userId => {
    try {
        let user = await User.findById(userId)
        return transformUser(user);
    }
    catch (err) {
        throw err;
    }
}

const users = async userIds => {
    try {
        let userArray = await User.find({ _id: { $in: userIds } })
        return userArray.map(user => {
            return transformUser(user)
        })
    }
    catch (err) {
        throw err;
    }

}

const transformUser = (user) => {
    return {
        ...user._doc,
        _id: user.id,
        friends: users.bind(this, user.friends),
        local: {
            username: user.local.username,
            email: user.local.email,
            password: null
        }
    }
}

const groups = async groupIds => {
    try {
        let groups = await Group.find({ _id: { $in: groupIds } })
        return groups.map(group => {
            return transformGroup(group)
        })
    }
    catch (err) {
        throw err;
    }
}

const singleGroup = async groupId => {
    try {
        let group = await Group.findById(groupId)
        return transformGroup(group)
    }
    catch (err) {
        throw err;
    }
}

const transformGroup = (group) => {
    return {
        ...group._doc,
        _id: group.id,
        creator: singleUser.bind(this, group.creator),
        people: users.bind(this, group.people)
    }
}

module.exports = {
    groups: async() => {
        try {
            let groups = await Group.find();
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
    createUser: async(args) => {
        try {
            let user = await User.findOne({ 'local.email': args.userInput.email });
            if (user) {
                throw new Error("User with email already exists")
            }
            let hash = await bcrypt.hash(args.userInput.password, 12);
            let newUser = new User({
                local: {
                    username: args.userInput.username,
                    email: args.userInput.email,
                    password: hash
                }
            })
            let response = await newUser.save();
            return transformUser(response);
        }
        catch (err) {
            throw err;
        }
    },
    login: async(args) => {
        try {
            let loggedUser = await User.findOne({ 'local.email': args.email });
            if (!loggedUser) {
                throw new Error("User with email not found");
            }
            let isEqual = await bcrypt.compare(args.password, loggedUser.local.password);
            if (!isEqual) {
                throw new Error("Password is incorrect")
            }
            let token = JWT.sign({ userId: loggedUser.id, email: loggedUser.email }, 'secret', {
                expiresIn: '1h'
            })
            return { userId: loggedUser.id, token: token, tokenExpiration: 1 }
        }
        catch (err) {
            throw err;
        }
    }
}

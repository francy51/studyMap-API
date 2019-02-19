var Group = require("../.././models/group")
var User = require("../.././models/user")
var mongoose = require('mongoose')
var bcrypt = require("bcrypt")
var JWT = require("jsonwebtoken")
var { transformUser } = require("../helpers/index")

module.exports = {
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
    },
    myProfile: async(args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error("Login please");
            }
            let user = await User.findById(req.userId);
            return user;
        }
        catch (err) {
            throw err;
        }
    }
}

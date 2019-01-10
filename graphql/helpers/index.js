var Group = require("../.././models/group")
var User = require("../.././models/user")

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

const transformSession = (session) => {
    return {
        ...session._doc,
        _id: session.id,
        creator: singleUser.bind(this, session.creator),
        atendee: users.bind(this, session.atendee),
        parentGroup: singleGroup.bind(this, session.parentGroup)
    }
}

exports.transformGroup = transformGroup;
exports.transformUser = transformUser;

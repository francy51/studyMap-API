var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var graphql = require('express-graphql')
var { buildSchema } = require("graphql")
var mongoose = require("mongoose")
var Group = require("./models/group")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var groupRouter = require('./routes/group')


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//API using graphql
app.use('/api', graphql({
    schema: buildSchema(`
    
        type Group {
            _id: ID!
            name: String!
            creationDate: String!
            isPrivate: Boolean!
            isClosed: Boolean!
        }
        
        input GroupInput {
            name: String!
            creatorId: String!
            isPrivate: Boolean!
        }
        
        type rootQuery {
            groups: [Group]
        }
    
        type rootMutation {
            createGroup(groupInput:GroupInput): Group!
        }
        schema{
            query: rootQuery
            mutation: rootMutation
        }
    `),
    rootValue: {
        groups: () => {
            return Group.find()
                .then(group => {
                    return group.map(
                        group => {
                            let clone = group._doc
                            clone._id = group._doc._id.toString()
                            return clone;
                        }
                    )
                })
                .catch(err => {
                    console.error(err);
                    throw err;
                })
        },
        createGroup: (args) => {
            let group = new Group({
                name: args.groupInput.name,
                _creatorId: mongoose.Types.ObjectId(args.groupInput.creatorid),
                creationDate: new Date(),
                isPrivate: args.groupInput.isPrivate,
                isClosed: false
            });

            return group
                .save()
                .then((result) => {
                    console.log(result);
                    let clone = result._doc
                    clone._id = result._doc._id.toString()
                    return clone
                })
                .catch(err => {
                    console.error(err)
                    throw err
                })
        }
    },
    graphiql: true

}));

mongoose.connect(`mongodb+srv://Francy:G!*n4Xi84faz@testcluster-e8bja.azure.mongodb.net/studyapp?retryWrites=true`, { useNewUrlParser: true }).catch(err => console.error(err))


//old routes
// app.use('/', indexRouter);
// app.use('/group', groupRouter)
// app.use('/users', usersRouter);
// app.use(function(req, res, next) {
//     res.status(404).send("URL not found")
// })

module.exports = app;

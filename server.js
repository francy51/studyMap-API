var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var graphql = require('express-graphql')
var mongoose = require("mongoose")
var Schema = require("./graphql/schema/index")
var Resolvers = require("./graphql/resolvers/index")
var isAuth = require("./middlewear/isAuth")
var mongoConfig = require("./config/mongo")
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(isAuth)

//API using graphql
app.use('/api', graphql({
    schema: Schema,
    rootValue: Resolvers,
    graphiql: true

}));

//TODO: CHANGE THIS SO THAT ITS PAST IN THROUGNH CONFIG
mongoose.connect(`mongodb+srv://${mongoConfig.username}:${mongoConfig.password}@testcluster-e8bja.azure.mongodb.net/studyapp?retryWrites=true`, { useNewUrlParser: true }).catch(err => console.error(err))

app.use(function(req, res, next) {
    res.status(404).send("URL not found")
})

module.exports = app;

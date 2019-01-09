var GroupResolver = require("./groupResolver")
var AuthResolver = require("./authResolver")
var SessionResolver = require("./sessionResolver")

//For development 
const userID = '5c2cde15a6dd2e15e92016d6'



module.exports = {
    ...GroupResolver,
    ...AuthResolver,
    ...SessionResolver
}

var { buildSchema } = require("graphql")

module.exports = buildSchema(`
    
        type Group {
            _id: ID!
            name: String!
            creator: User!
            creationDate: String!
            isPrivate: Boolean!
            isClosed: Boolean!
        }
        
        type LocalUserData {
            username: String!
            email: String!
            password: String
        }
        
        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }
        
        type User {
            _id: ID!
            local: LocalUserData!
        }
        
        input GroupInput {
            name: String!
            creatorId: String!
            isPrivate: Boolean!
        }
        
        input UserInput {
            username: String!
            email: String!
            password: String!
        }
        
        type rootQuery {
            groups: [Group!]!
            login(email: String!, password: String!): AuthData!
            
        }
    
        type rootMutation {
            createGroup(groupInput:GroupInput): Group!
            createUser(userInput: UserInput): User
        }
        
        schema{
            query: rootQuery
            mutation: rootMutation
        }
    `)

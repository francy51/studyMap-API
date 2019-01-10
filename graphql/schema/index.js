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
        type LocationData {
            
            lng: Float!
            lat: Float!
            
        }
        
        type Session {
            subject: String!
            creator: User!
            creationdate: String,
            startdate: String,
            location: LocationData!
            isended: Boolean,
            attendee: [User!]!,
            maxPeople: Int!
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
        
        input SessionInput {
            subject: String!
            creator: String!
            creationdate: String,
            startdate: String,
            lng: Float!
            lat: Float!
            isended: Boolean,
            maxPeople: Int!
        }
        
        type rootQuery {
            groups: [Group!]!
            login(email: String!, password: String!): AuthData!
            findGroup(id:String!): Group!
            getGroupSessions(id: String!): [Session!]!
            getGroupSession(id: String!): Session!
        }
    
        type rootMutation {
            createGroup(groupInput:GroupInput): Group!
            createUser(userInput: UserInput): User
            createSessions(sessionInput: SessionInput): Session!
        }
        
        schema{
            query: rootQuery
            mutation: rootMutation
        }
    `)

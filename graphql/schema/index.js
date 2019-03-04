var { buildSchema } = require("graphql")

module.exports = buildSchema(`
    
        type Group {
            id: ID!
            name: String!
            description: String!
            creator: User!
            creationDate: String!
            isPrivate: Boolean!
            isClosed: Boolean!
            people: [User!]!
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
        
        type Card {
            front: String!,
            back: String!,
        }
        
        type NoteContent {
            header: String!,
            body: String!
        }
        
        type Notes {
            owner: User!
            notes: [NoteContent!]!,
            cards: [Card!]!,
            isPrivate: Boolean,
            sharedTo: [User]!,
            collaborators: [User!]!
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
            id: ID!
            local: LocalUserData!
        }
        
        input GroupInput {
            name: String!
            description: String!
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
            parentGroup: String!
        }
        
        input NoteContentInput{
            header: String!,
            body: String!
        }
        
        input CardInput{
            front: String!,
            back: String!
        }
        
        input NotesInput {
            owner: String!
            notes: [NoteContentInput!]!,
            cards: [CardInput!]!,
            isPrivate: Boolean,
            sharedTo: [String]!,
            collaborators: [String!]!
        }
        
        type rootQuery {
            groups(page: Int!): [Group!]!
            myGroups: [Group!]!
            login(email: String!, password: String!): AuthData!
            findNotes(id: String!): Notes!
            findGroup(id: String!): Group!
            findSession(groupiD: [String!]!): [Session!]!
            getGroupSessions(id: String!): [Session!]!
            getGroupSession(id: String!): Session!
            myProfile: User!
        }
    
        type rootMutation {
            createGroup(groupInput:GroupInput): Group!
            createUser(userInput: UserInput): User
            createSessions(sessionInput: SessionInput): Session!
            createNotes(notesInput: NotesInput): Notes!
            joinGroup(id:String!):Group! 
        }
        
        schema{
            query: rootQuery
            mutation: rootMutation
        }
    `)

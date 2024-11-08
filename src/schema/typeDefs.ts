
// This gql variable is so that we use the GraphQL Syntax Highlighting extension
// This makes the template literal string in typeDefs, easier to read
const gql = String.raw;


const typeDefs = gql`
    type Like {
        user: User
    }
    
    type Note {
        _id: ID
        text: String
        user: User
        likes: [Like]
    }

    type User {
        _id: ID
        email: String
        notes: [Note]
    }

    type Response {
        user: User
        errors: [String]
    }

    type Query {
        getUserNotesById(user_id: ID): User
        getAllNotes: [Note]
        getLikesForNote(note_id: ID): [Like]
    }

    type Mutation {
        createUser(email: String!, password: String!): Response
        addUserNote(user_id: ID, text: String): User
        deleteNoteForUser(user_id: ID, note_id: ID): String
        addLikeToNote(user_id: ID, note_id: ID): String
    }

`;


export default typeDefs;
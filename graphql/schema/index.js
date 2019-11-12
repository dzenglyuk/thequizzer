const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Survey {
    _id: ID!
    title: String!
    description: String
    author: User!
}

type User {
    _id: ID!
    email: String!
    password: String
    username: String!
    createdSurveys: [Survey!]
}

input SurveyInput {
    title: String!
    description: String
    author: String
}

input UserInput {
    email: String!
    password: String
    username: String!
}

type RootQuery {
    surveys: [Survey!]!
}

type RootMutation {
    createSurvey(surveyInput: SurveyInput): Survey
    createUser(userInput: UserInput): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

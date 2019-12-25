const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Attempt {
    _id: ID!
    survey: Survey!
    user: String
    createdAt: String!
    updatedAt: String
    answers: [String!]
}

type Question {
    questionValue: String!
    questionType: String!
}

type Survey {
    _id: ID!
    title: String!
    description: String
    author: User!
    questions: [Question!]!
    attempts: [Attempt!]
}

type User {
    _id: ID!
    email: String!
    password: String
    username: String!
    createdSurveys: [Survey!]
}

type AuthData {
    userId: ID!
    token: String!
    username: String!
    tokenExpiration: Int!
}

input AttemptInput {
    survey: String!
    user: String
    createdAt: String
    updatedAt: String
    answers: [String!]
}

input QuestionInput {
    values: [String!]
    types: [String!]
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
    surveys: [Survey!]
    survey(surveyId: String!): Survey!
    attempts: [Attempt!]
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createSurvey(surveyInput: SurveyInput!, questionInput: QuestionInput!): Survey
    deleteSurvey(surveyId: String!): Survey
    createUser(userInput: UserInput): User
    makeAttempt(attemptInput: AttemptInput): Attempt
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

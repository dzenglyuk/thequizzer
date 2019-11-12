const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Survey = require('./models/survey');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Survey {
            _id: ID!
            title: String!
            description: String
            author: String!
        }
        
        type User {
            _id: ID!
            email: String!
            password: String
            username: String!
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
    `),
    rootValue: {
        surveys: () => {
            return Survey.find()
                .then(surveys => {
                    return surveys.map(survey => {
                        return {...survey._doc};
                    });
                })
                .catch(err => {
                    throw err;
                });
        },
        createSurvey: args => {
            const survey = new Survey({
                title: args.surveyInput.title,
                description: args.surveyInput.description,
                author: '5dcaca3d667ba12df448e67c'
            });
            let createdSurvey;
            return survey
                .save()
                .then(res => {
                    createdSurvey = {...res._doc};
                    return User.findById('5dcaca3d667ba12df448e67c');
                })
                .then(user => {
                    if (!user) {
                        throw new Error('No such user');
                    }
                    user.createdSurveys.push(survey);
                    return user.save();
                })
                .then(res => {
                    return createdSurvey;
                })
                .catch(err => {
                    throw err;
                });
        },
        createUser: args => {
            return User.findOne({email: args.userInput.email}).then(user => {
                if (user) {
                    throw new Error('User already exist');
                }
                return bcrypt
                .hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword,
                    username: args.userInput.username
                });
                return user.save();
            })
            .then(res => {
                return {...res._doc, password: null};
            })
            .catch(err => {
                throw err;
            });
        }
    },
    graphiql: true
}));

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ltzhu.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(_ => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});

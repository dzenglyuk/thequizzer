const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            surveys: [String!]!
        }    

        type RootMutation {
            createSurvey(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        surveys: () => {
            return ['1', '2', '3'];
        },
        createSurvey: (args) => {
            const surveyName = args.name;
            return surveyName;
        }
    },
    graphiql: true
}));

app.listen(3000);
const userResolver = require('./user');
const surveysResolver = require('./surveys');
const attemptsResolver = require('./attempts');

const rootResolver = {
  ...userResolver,
  ...surveysResolver,
  ...attemptsResolver
};

module.exports = rootResolver;
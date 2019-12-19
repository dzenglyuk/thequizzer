const Attempt = require("../../models/attempt");
const Survey = require("../../models/survey");
const { transformAttempt } = require("./merge");

module.exports = {
  attempts: async (args, req) => {
    if (!req.isAuth) {
        throw new Error('Unauthenticated');
    }
    try {
      const attempts = await Attempt.find();
      return attempts.map(attempt => {
        return transformAttempt(attempt);
      });
    } catch (err) {
      throw err;
    }
  },
  makeAttempt: async (args, req) => {
    const fetchedSurvey = await Survey.findOne({
      _id: args.attemptInput.survey
    });
    if (!fetchedSurvey) {
      throw new Error("No such survey");
    }
    const attempt = new Attempt({
      user: req.userId | 'Anonymous',
      survey: fetchedSurvey,
      answers: args.attemptInput.answers
    });
    let createdAttempt;
    try {
      const result = await attempt.save();
      createdAttempt = transformAttempt(result);

      fetchedSurvey.attempts.push(attempt);
      await fetchedSurvey.save();

      return createdAttempt;
    } catch (err) {
      throw err;
    }
  }
};

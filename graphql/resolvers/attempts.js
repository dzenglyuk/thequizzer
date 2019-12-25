const Attempt = require("../../models/attempt");
const User = require("../../models/user");
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
    try {
      const fetchedSurvey = await Survey.findOne({
        _id: args.attemptInput.survey
      });
      if (!fetchedSurvey) {
        throw new Error("No such survey");
      }
      const user = await User.findById(req.userId);
      const attempt = new Attempt({
        // user: user || 'Anonymous',
        survey: fetchedSurvey,
        answers: args.attemptInput.answers
      });
      let createdAttempt;
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

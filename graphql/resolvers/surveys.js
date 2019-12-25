const Survey = require("../../models/survey");
const Attempt = require("../../models/attempt");
const User = require("../../models/user");
const { transformSurvey } = require("./merge");

module.exports = {
  surveys: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const surveys = await Survey.find();
      return surveys.map(survey => {
        return transformSurvey(survey);
      });
    } catch (err) {
      throw err;
    }
  },
  survey: async (args, req) => {
    try {
      const survey = await Survey.findById(args.surveyId);
      return transformSurvey(survey);
    } catch (err) {
      throw err;
    }
  },
  createSurvey: async (args, req) => {
    if (!req.isAuth) {
        throw new Error('Unauthenticated');
    }
    let questions = [];
    for (let i = 0; i < args.questionInput.values.length - 1; i++) {
      questions = [...questions, {questionValue: args.questionInput.values[i], questionType: args.questionInput.types[i]}];
    }
    const survey = new Survey({
      title: args.surveyInput.title,
      description: args.surveyInput.description,
      author: req.userId,
      questions: questions
    });
    let createdSurvey;
    try {
      const result = await survey.save();
      createdSurvey = transformSurvey(result);
      const author = await User.findById(req.userId);
      if (!author) {
        throw new Error("No such user");
      }
      author.createdSurveys.push(survey);
      await author.save();

      return createdSurvey;
    } catch (err) {
      throw err;
    }
  },
  deleteSurvey: async (args, req) => {
    if (!req.isAuth) {
        throw new Error('Unauthenticated');
    }
    try {
      // Should be fixed
      await Survey.deleteOne({ _id: args.surveyId });
      await Attempt.deleteMany({ survey: args.surveyId });
    } catch (err) {
      throw err;
    }
  }
};

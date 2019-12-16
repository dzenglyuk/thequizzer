const Survey = require("../../models/survey");
const Attempt = require("../../models/attempt");
const User = require("../../models/user");
const { transformSurvey } = require("./merge");

module.exports = {
  surveys: async () => {
    try {
      const surveys = await Survey.find();
      return surveys.map(survey => {
        return transformSurvey(survey);
      });
    } catch (err) {
      throw err;
    }
  },
  createSurvey: async args => {
    const survey = new Survey({
      title: args.surveyInput.title,
      description: args.surveyInput.description,
      author: "5dcd3714b1ee056eb0c806a8",
      questions: args.surveyInput.questions
    });
    let createdSurvey;
    try {
      const result = await survey.save();
      createdSurvey = transformSurvey(result);
      const author = await User.findById("5dcd3714b1ee056eb0c806a8");
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
  deleteSurvey: async args => {
    try {
      // Should be fixed
      await Survey.deleteOne({ _id: args.surveyId });
      await Attempt.deleteMany({ survey: args.surveyId });
    } catch (err) {
      throw err;
    }
  }
};

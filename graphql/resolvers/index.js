const bcrypt = require("bcryptjs");

const Survey = require("../../models/survey");
const User = require("../../models/user");

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdSurveys: surveys.bind(this, user._doc.createdSurveys)
    };
  } catch (err) {
    throw err;
  }
};

const surveys = async surveyIds => {
  try {
    const surveys = await Survey.find({ _id: { $in: surveyIds } });
    return surveys.map(survey => {
      return { ...survey._doc, author: user.bind(this, survey.author) };
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  surveys: async () => {
    try {
      const surveys = await Survey.find();
      return surveys.map(survey => {
        return { ...survey._doc, author: user.bind(this, survey._doc.author) };
      });
    } catch (err) {
      throw err;
    }
  },
  createSurvey: async args => {
    const survey = new Survey({
      title: args.surveyInput.title,
      description: args.surveyInput.description,
      author: "5dcae58a4560f1a224311b4e"
    });
    let createdSurvey;
    try {
      const result = await survey.save();
      createdSurvey = {
        ...result._doc,
        author: user.bind(this, result._doc.author)
      };
      const author = await User.findById("5dcae58a4560f1a224311b4e");
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
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User already exist");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        username: args.userInput.username
      });
      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  }
};

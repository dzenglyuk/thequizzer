const Survey = require("../../models/survey");
const User = require("../../models/user");
const Attempt = require("../../models/attempt");
const { dateToString } = require("../../helpers/date");

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdSurveys: surveys.bind(this, user.createdSurveys)
    };
  } catch (err) {
    throw err;
  }
};

const singleSurvey = async surveyId => {
  try {
    const survey = await Survey.findById(surveyId);
    if (survey !== null) {
        return transformSurvey(survey);
    } else {
        return 'No such survey';
    }
  } catch (err) {
    throw err;
  }
};

const surveys = async surveyIds => {
  try {
    const surveys = await Survey.find({ _id: { $in: surveyIds } });
    return surveys.map(survey => {
      return transformSurvey(survey);
    });
  } catch (err) {
    throw err;
  }
};

const attempts = async attemptIds => {
  try {
    const attempts = await Attempt.find({ _id: { $in: attemptIds } });
    return attempts.map(attempt => {
      return transformAttempt(attempt);
    });
  } catch (err) {
    throw err;
  }
};

const transformSurvey = survey => {
  return {
    ...survey._doc,
    _id: survey._id,
    author: user.bind(this, survey._doc.author),
    attempts: attempts.bind(this, survey._doc.attempts)
  };
};

const transformAttempt = attempt => {
    return {
    ...attempt._doc,
    _id: attempt._id,
    user: user.bind(this, attempt._doc.user),
    survey: singleSurvey.bind(this, attempt._doc.survey),
    createdAt: dateToString(attempt._doc.createdAt),
    updatedAt: dateToString(attempt._doc.updatedAt)
  };
};

module.exports = {
  transformAttempt: transformAttempt,
  transformSurvey: transformSurvey
};

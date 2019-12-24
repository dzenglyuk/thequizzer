const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const surveySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [
    {
      questionValue: String,
      questionType: String
    }
  ],
  attempts:[
    {
        type: Schema.Types.ObjectId,
        ref: 'Attempt'
    }
  ]
});

module.exports = mongoose.model('Survey', surveySchema);

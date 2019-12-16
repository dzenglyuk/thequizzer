const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const attemptSchema = new Schema(
  {
    survey: {
      type: Schema.Types.ObjectId,
      ref: 'Survey'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    answers: [
      {
          type: String
      }
    ]
  },  
  { timestamps: true }
);

module.exports = mongoose.model('Attempt', attemptSchema);

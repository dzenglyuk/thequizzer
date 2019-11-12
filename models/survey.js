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
        ref: 'User'
    }
});

module.exports = mongoose.model('Survey', surveySchema);

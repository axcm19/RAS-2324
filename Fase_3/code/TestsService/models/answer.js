const mongoose = require('mongoose');

var answerSchema = new mongoose.Schema({
    questionId: Number,
    studentId: String,
    testId: String,
    text: String,
    options: [String],
    score: Number
});

module.exports = mongoose.model('answer',answerSchema)
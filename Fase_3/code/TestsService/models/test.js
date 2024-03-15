const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var studentSchema = new mongoose.Schema({
    _id: String,
    classroom: String,
    score: Number // se calhar dá mais jeito pra nao precisar andar a somar de novo por answer sempre q quiser consultar e etc
})

var classroomSchema = new mongoose.Schema({
    _id: String,
    date: String,
    version: Number
})

var optionSchema = new mongoose.Schema({
    description: String,
    grade: Number,  
    solution: String
})

var questionSchema = new mongoose.Schema({
    _id: Number,
    description: String,
    type: Number,
    grade: Number,
    options: [optionSchema]
})


var versionSchema = new mongoose.Schema({
    _id: Number,
    questions: [questionSchema]
})


var testSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: String,
    throwback: Boolean,
    date: String,
    duration: Number,
    randomness: Boolean,    
    teachers: [String],
    students: [studentSchema],
    classrooms: [classroomSchema],
    versions: [versionSchema],
});

module.exports = mongoose.model('test',testSchema)
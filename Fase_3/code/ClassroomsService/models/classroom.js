const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  floor: String,
  building: String,
  capacity: Number,
  reservation: [new mongoose.Schema({
    startDate: String,
    endDate: String
  })]
});

module.exports = mongoose.model('classroom', classroomSchema);
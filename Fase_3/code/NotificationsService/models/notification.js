const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: String,
  date: Date,
  text: String,
  status: Boolean,
  type: Number // 0 - classroomRemoval
               // 1 - testSharing
               // 2 - gradesAvailable
               // 3 - registration 
});

module.exports = mongoose.model('notification', notificationSchema);
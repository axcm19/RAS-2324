var express = require('express');
var router = express.Router();
var Classroom = require('../controllers/classroom');

/* GET all classrooms. */
router.get('/classrooms', function(req, res, next) {
  Classroom.getAllClassrooms()
    .then(classrooms => {
      res.status(200).json(classrooms);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: error, message: "Error fetching classroom information" })}
      );
});

/* GET the information of a classroom. */
router.get('/classrooms/:id', function(req, res, next) {
  const classroomId = req.params.id;
  Classroom.getClassroomById(classroomId)
    .then(classroom => {
      if (!classroom) {
        res.status(404).json({ message: "Classroom not found" });
      } else {
        res.status(200).json(classroom);
      }
    })
    .catch(error => res.status(500).json({ error: error, message: "Error fetching classroom information" }));
});


/* GET the available classrooms in a given schedule. */
router.get('/classrooms/schedule/:date/:duration', function(req, res, next) {
  const date = req.params.date;
  const duration = parseInt(req.params.duration); // assuming duration is in minutes

  Classroom.getAvailableClassrooms(date, duration)
    .then(classrooms => {
      if (classrooms.length === 0) {
        res.status(404).json({ message: "No available classrooms found" });
      } else {
        res.status(200).json(classrooms);
      }
    })
    .catch(error => res.status(500).json({ error: error, message: "Error fetching available classrooms" }));
});

/* PUT a reservation to a classroom */
// Req.body:
/*
  {
    "_id": "1",
    "startDate": "2020-06-24T10:00:00.000Z",
    "endDate": "2020-06-24T11:30:00.000Z"
  }
*/
// Response:
/*

*/
router.put('/classrooms/reservation', function(req, res, next) {
  Classroom.reserveClassroom(req.body)
    .then(data => res.status(201).json(data))
    .catch(error => res.status(500).json({error: error, message: "Could not reserve the classroom"}))
});

/* POST a new classroom */
// Req.body:
/*
[
  {
    "floor": "1",
    "building": "CP1",
    "capacity": 30
  }
]
*/
router.post('/classrooms', function(req, res, next) {
  Classroom.addClassroom(req.body)
    .then(data => res.status(201).json(data))
    .catch(error => res.status(500).json({error: error, message: "Could not insert the classroom"}))
});

/* DELETE a classroom */
router.delete('/classrooms/:classroomId', function(req, res, next) {
  Classroom.deleteClassroom(req.params.classroomId)
    .then(data => res.status(201).json(data))
    .catch(error => res.status(500).json({error: error, message: "Could not delete the classroom"}))
});

/* DELETE a classroom reservation */
router.delete('/classrooms/reservation/:classroomId/:reservationId', function(req, res, next) {
  Classroom.deleteReservation(req.params.classroomId, req.params.reservationId)
    .then(data => res.status(201).json(data))
    .catch(error => res.status(500).json({error: error, message: "Could not delete the classroom"}))
});

module.exports = router;

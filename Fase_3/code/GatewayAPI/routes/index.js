var express = require('express');
var router = express.Router();
var axios = require('axios');
var env = require('../config/env');
var auth = require('../auth/auth')

// NOTIFICATIONS

/* GET notifications from a user */
router.get('/notifications/:idUser', auth.verificaToken, function(req, res, next) {
  const idUser = req.params.idUser;

  axios.get(env.notificationsAcessPoint + '/notifications/' + idUser)
  .then(notifications => {
    res.status(200).json(notifications.data);
  })
  .catch(error => {
    console.error("Erro a obter notificações por ID do user:", error);
    res.status(500).json({ error: 'Erro ao obter notificações por ID do user' });
  })
});

/* GET number of unread notifications from a user */
router.get('/notifications/unread/:idUser', auth.verificaToken, function(req, res, next) {
  const idUser = req.params.idUser;

  axios.get(env.notificationsAcessPoint + '/notifications/unread' + idUser)
  .then(numberOfNotifications => {
    res.status(200).json(numberOfNotifications.data);
  })
  .catch(error => {
    console.error("Erro ao obter número de notificações não lidas por user:", error);
    res.status(500).json({ error: 'Erro ao obter número de notificações não lidas por user' });
  })
});

/* POST Test registration notification */
router.post('/notifications/testRegistration', auth.verificaToken, function(req, res, next){
  axios.post(env.notificationsAcessPoint + '/notifications/registration')
  .then(response => {
    res.status(200).json(response.data)
  })
  .catch(error => {
    console.error("Erro a enviar notificação de registo no teste:", error);
    res.status(500).json({ error: 'Erro a enviar notificação de registo no teste' });
  })
})

/* POST Test registration notification */
router.post('/notifications/testRegistration', auth.verificaToken, function(req, res, next){
  axios.post(env.notificationsAcessPoint + '/notifications/registration')
  .then(response => {
    res.status(200).json(response.data)
  })
  .catch(error => {
    console.error("Erro a enviar notificação de registo no teste:", error);
    res.status(500).json({ error: 'Erro a enviar notificação de registo no teste' });
  })
})

/* POST grades available notification */
router.post('/gradesAvailable/:testId', auth.verificaToken, function(req, res, next){
  // Send message to the tests microservice
  axios.get(env.testsAccessPoint + '/publishClassifications/' + req.params.testId)
  .then(studentGrades => {
    // Send notification to the notifications microservice
    studentGrades.forEach(element => {
      axios.post(env.notificationsAcessPoint + '/notifications/gradesAvailable', element)
    });
    res.status(200).json({"successful": true})
  })
  .catch(error => {
    console.error("Erro a receber as notas dos alunos:", error);
    res.status(500).json({ error: 'Erro a receber as notas dos alunos' });
  })
})

/* POST Test sharing notification */
router.post('/testSharing/:testId', auth.verificaToken, function(req, res, next){
  let teachersToValidate = []
  req.body.forEach(element => {
    teachersToValidate.push({'email': element, 'role': 1})
  });

  // Validate teachers
  axios.post(env.usersAcessPoint + '/users/validate' + "?secret_token=" + req.query.secret_token, teachersToValidate)
  .then(response => {
    if (response.data["successful"] & response.data["successful"] == true){
      // Send notification
      let newBody = {"testId": req.params.testId, "teachers": req.body}
      axios.post(env.notificationsAcessPoint + '/notifications/testSharing', newBody)
      .then(response => {
        res.status(200).json(response.data)
      })
      .catch(error => {
        console.error("Erro a enviar notificação de partilha de teste:", error);
        res.status(500).json({ error: 'Erro a enviar notificação de partilha de teste' });
      })
    }
  })
  .catch(error => {
    console.error("Erro a validar professores:", error);
    res.status(500).json({ error: 'Erro a a validar professores' });
  })
})

// CLASSROOMS

/* ADD a classroom to the system */
// Req.body:
/*
[
  {
    "floor": "1",
    "building": "CP1",
    "capacity": 30
  }
  ...
]
*/
router.post('/classrooms', auth.verificaToken, function(req, res, next) {
  axios.post(env.classroomsAcessPoint + '/classrooms', req.body)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not add the classroom. ERROR: ", error);
    res.status(500).json({ error: "Could not add the classroom" });
  })
});

/* GET the available classrooms in a given schedule. */
router.get('/classrooms/:date/:duration', auth.verificaToken, function(req, res, next) {
  axios.get(env.classroomsAcessPoint + `/classrooms/schedule/${req.params.date}/${req.params.duration}`)
  .then(classrooms => {
    res.status(200).json(classrooms.data);
  })
  .catch(error => {
    console.error("Could not get the classrooms. ERROR: ", error);
    res.status(500).json({ error: "Could not get the classrooms" });
  })
});

/* GET all classrooms */ 
router.get('/classrooms', function(req, res, next) {
  axios.get(env.classroomsAcessPoint + '/classrooms')
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({ error: error, message: "Error fetching classroom information" })});
});

/* DELETE a classroom from the system */
router.delete('/classrooms/:classroomId', auth.verificaToken, function(req, res, next) {
  const classroomId = req.params.classroomId;

  axios.delete(env.classroomsAcessPoint + '/classrooms/' + classroomId)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not delete the classroom. ERROR: ", error);
    res.status(500).json({ error: "Could not delete the classroom" });
  })
});



// USERS

/* GET a user */
router.get('/users/:idUser', auth.verificaToken ,function(req, res, next) { // VERIFIED
  const idUser = req.params.idUser;
  console.log(req.query)
  axios.get(env.usersAcessPoint + '/users/' + idUser + "?secret_token=" + req.query.secret_token)
  .then(user => {
    res.status(200).json(user.data);
  })
  .catch(error => {
    console.error("Could not get the user. ERROR:", error);
    res.status(500).json({ error: 'Could not get the user' });
  })
});

/* Edit user. */
router.put('/users', auth.verificaToken, function(req, res, next) {
  axios.put(env.usersAcessPoint + '/users' + "?secret_token=" + req.query.secret_token, req.body)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not edit the user. ERROR: ", error);
    res.status(500).json({ error: "Could not edit the user" });
  })
});

/* Validate users */
router.post('/users/validate', auth.verificaToken, function(req, res, next) {
  axios.post(env.usersAcessPoint + '/users/validate' + "?secret_token=" + req.query.secret_token, req.body)
  .then(result => {
    res.status(200).json(result.data);
  })
  .catch(error => {
    //console.log(error.response.data)
    res.status(500).json(error.data);
  })
})

/* Insert users. */
router.post('/users', auth.verificaToken, function(req, res, next) { // VERIFIED
  axios.post(env.usersAcessPoint + '/users' + "?secret_token=" + req.query.secret_token, req.body)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not insert the users. ERROR: ", error);
    res.status(500).json({ error: "Could not insert the users" });
  })
});

/* Login */
router.post('/login', function(req, res, next) { // VERIFIED
  console.log("Loginnnn")
  axios.post(env.usersAcessPoint + '/login', req.body)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not authenticate the user.");
    res.status(500).json({ error: "Could not authenticate the user" });
  })
});

/* Register */
router.post('/register', function(req, res, next) { // VERIFIED
  console.log(req.body)
  axios.post(env.usersAcessPoint + '/register', req.body)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not register the user. ERROR: ", error);
    res.status(500).json({ error: "Could not register the user" });
  })
});



// TESTS

/* Create a new test */
router.post('/tests', auth.verificaToken, function(req, res, next) { // Must test to see if is working correctly
  const classrooms = req.body.classrooms;
  let reservations = [];
  console.log(req.body)
  try{ 
    // Make reservations for each classroom
    for (const classroom of classrooms) {
      const reservationData = {
        _id: classroom._id,
        startDate: req.body.date,
        endDate: new Date(new Date(req.body.date).getTime() + (req.body.duration * 60 * 1000)).toISOString() // Calculate end date based on duration
      };
      console.log(reservationData)
      
      axios.put(env.classroomsAcessPoint + '/classrooms/reservation', reservationData)
      .then(response => {
        const reservation = {"reservationId: ": response.data, "classroomId": classroom}
        reservations.push(reservation);
        console.log("Reservation made successfully: " + reservation);
      })
    }

    // Create the test
    axios.post(env.testsAccessPoint + '/tests', req.body)
    .then(response => {
      res.status(200).json(response.data);
    })
  } catch (error) {
    console.error("Could not create the test. ERROR: ", error);

    // If any reservation fails, rollback the reservations
    for (const reservation of reservations) {
      try {
        axios.delete(env.classroomsAcessPoint + `/classrooms/reservation/${reservation.classroomId}/${reservation.reservationId}`); // Rollback reservation
      } catch (rollbackError) {
        console.error("Rollback failed for reservation: ", reservation._id, ". ERROR: ", rollbackError);
      }
    }

    res.status(500).json({ error: "Could not create the test." });
  }  
})

/* Update test details */
router.put('/tests', auth.verificaToken, function(req, res, next) {
  axios.put(env.testsAccessPoint + '/tests/' + req.body._id + '/details', req.body)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not update the test. ERROR: ", error);
    res.status(500).json({ error: "Could not update the test." });
  })
})

/* Add version (with questions) */
router.put('/tests/version', auth.verificaToken, function(req, res, next) {
  axios.put(env.testsAccessPoint + '/tests/' + req.body.test_id + '/version/' + req.body._id, req.body)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not update the test. ERROR: ", error);
    res.status(500).json({ error: "Could not update the test." });
  })
})

/* Retrieve test details */ 
router.get('/test/:testId', auth.verificaToken, function(req, res, next) {
  axios.get(env.testsAccessPoint + '/test/' + req.params.testId)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not retrieve the test. ERROR: ", error);
    res.status(500).json({ error: "Could not retrieve the test." });
  })
})

/* GET students from test */ 
router.get('/tests/:idTest/students', function(req, res, next) {
  axios.get(env.testsAccessPoint + '/tests/' + req.params.idTest + '/students')
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not retrieve the test. ERROR: ", error);
    res.status(500).json({ error: "Could not retrieve the test." });
  })
})

/* Start test */
router.get('/startTest/:idTest/student/:idStudent'/*, auth.verificaToken,*/, function(req, res, next) {
  axios.get(env.testsAccessPoint + '/startTest/' + req.params.idTest + '/student/' + req.params.idStudent)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not start the test. ERROR: ", error);
    res.status(500).json({ error: "Could not start the test." });
  })
})

/* Save answers from a student */
router.put('/tests/:idTest/submit/:idUser', /*auth.verificaToken,*/ function(req, res, next) {
  axios.put(env.testsAccessPoint + '/tests/' + req.params.idTest + '/submit/' + req.params.idUser, req.body)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not retrieve the tests from a user. ERROR: ", error);
    res.status(500).json({ error: "Could not retrieve the tests from a user." });
  })
})

/* Retrieve tests from given user */
router.get('/tests/:userId'/*, auth.verificaToken*/, function(req, res, next) {
  axios.get(env.testsAccessPoint + '/tests/' + req.params.userId, req.body)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not retrieve the tests from a user. ERROR: ", error);
    res.status(500).json({ error: "Could not retrieve the tests from a user." });
  })
})

/* Share test with other professors */ 
router.put('/tests/:idTest', auth.verificaToken, function(req, res, next) {
  axios.put(env.testsAccessPoint + '/tests/' + req.params.idTest + '/share', req.body)
  .then(response => {
    res.status(200).json(response.data);
    // Serviço das notificações -> enviar pedido
  })
  .catch(error => {
    console.error("Could not share test with other professors. ERROR: ", error);
    res.status(500).json({ error: "Could not share test with other professors." });
  })
}) 

/* Automatically evaluate the test */
router.get('/evaluateTest/:testId/student/:studentId'/*, auth.verificaToken*/, function(req, res, next) {
  axios.get(env.testsAccessPoint + '/evaluateTest/' + req.params.testId + '/student/'+ req.params.studentId)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not automatically evaluate the test. ERROR: ", error);
    res.status(500).json({ error: "Could not automatically evaluate the test" });
  })
})

/* Manually evaluate the test */
router.put('/evaluateTest/:idTest/:idStudent'/*, auth.verificaToken*/, function(req, res, next) {
  axios.put(env.testsAccessPoint + '/evaluateTest/' + req.params.idTest + '/'+ req.params.idStudent, req.body)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not manually evaluate the test. ERROR: ", error);
    res.status(500).json({ error: "Could not evaluate the test" });
  })
})

/* Consult test */
router.get('/viewtest/:testId/student/:idStudent', function(req,res) {
  axios.get(env.testsAccessPoint + '/viewtest/' + req.params.testId + '/student/'+ req.params.idStudent)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not view the test from user. ERROR: ", error);
    res.status(500).json({ error: "Could not view the test from user" });
  })
})

/* Update Questions */
/*router.put('/updateQuestions/:idTest/version/:idVersion', auth.verificaToken, function(req,res) {
  axios.put(env.testsAccessPoint + '/tests/' + req.params.idTest, + '/version/' + req.params.idVersion, req.body)
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    console.error("Could not update the questions. ERROR: ", error);
    res.status(500).json({ error: "Could not update the questions" });
  })
})*/

/* Publish Classifications */
router.get('/publishClassifications/:idTest', auth.verificaToken, function(req,res) {
  // Serviço Provas -> get test details
  
  axios.get(env.testsAccessPoint + '/publishClassifications/' + req.params.idTest)
  .then(response => {
    res.status(200).json(response.data); 
    
    // Serviço das notificações -> notificar os alunos
  })
  .catch(error => {
    console.error("Could not publish the classifications. ERROR: ", error);
    res.status(500).json({ error: "Could not publish the classifications" });
  })
})

module.exports = router;

var express = require('express');
var router = express.Router();
var Notification = require('../controllers/notification');



/* GET notifications from a user */
router.get('/notifications/:idUser', function(req, res, next) {
  const idUser = req.params.idUser;

  Notification.getIdUser(idUser)
      .then(notifications => {
          res.status(200).json(notifications);
      })
      .catch(error => {
          console.error("Erro a obter notificações por ID do user:", error);
          res.status(500).json({ error: 'Erro ao obter notificações por ID do user' });
      });
});

/* GET number of unread notifications from a user */
router.get('/notifications/unread/:idUser', function(req, res) {
  const idUser = req.params.idUser;

  Notification.getUnreadCount(idUser)
      .then(function(unreadCount) {
          res.status(200).json({ unreadCount: unreadCount });
      })
      .catch(function(error) {
          console.error("Erro ao obter número de notificações não lidas por user:", error);
          res.status(500).json({ error: 'Erro ao obter número de notificações não lidas por user' });
      });
});



/* POST notification of a classroom being removed */
router.post('/notifications/classroomRemoval', function(req, res) {
    const salaId= req.body.classroomId
    const testId = req.body.testId
    const teachersId = req.body.teachersId
    Notification.createNotificationForUser(salaId,testId, teachersId)
    .then(data => res.status(201).json(data))
    .catch(error => res.status(500).json({error: error, message: "Could not insert the Notification Type 0"}))
});

/* POST notification of a test being shared */
router.post('/notifications/testSharing', function(req, res, next) {
  const { testId, teachers } = req.body;
  Notification.notificationType1(testId , teachers)
  .then(data => res.status(201).json(data))
  .catch(error => res.status(500).json({error: error, message: "Could not insert the Notification Type 1"}))
});

/* POST notification of test grades being made available */
router.post('/notifications/gradesAvailable', function(req, res, next) {
  Notification.notificationType2(req.body)
  .then(data => res.status(201).json(data))
  .catch(error => res.status(500).json({error: error, message: "Could not insert the Notification Type 2"}))
});

/* POST notification of the registration of a user */
router.post('/notifications/registration', function(req, res, next) {
  Notification.notificationType3(req.body)
  .then(data => res.status(201).json(data))
  .catch(error => res.status(500).json({error: error, message: "Could not insert the Notification Type 3"}))
});

module.exports = router;

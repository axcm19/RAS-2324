var express = require('express');
var router = express.Router();
var User = require('../controllers/user')

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/


/* GET the information of a user. */
router.get('/:id', function(req, res, next) {
  User.getUser(req.params.id)
  .then(data => res.status(201).json(data))
  .catch(error => res.status(500).json({error: error, message: "Could not get the user."}))
});

/* DELETE user from database. */
router.delete('/:id', function(req, res, next) {
  User.deleteUser(req.params.id)
  .then(data => res.status(201).json(data))
  .catch(error => res.status(500).json({error: error, message: "Could not delete the user."}))
});

/* PUT new email in a user. */
router.put('', function(req, res, next) {
  User.editUserEmail(req.body)
  .then(data => res.status(201).json(data))
  .catch(error => res.status(500).json({error: error, message: "Could not edit the user."}))
});

/* PUT new password in a user. */
router.put('',function(req, res, next) {
  User.editUserPassword(req.body)
  .then(data => res.status(201).json(data))
  .catch(error => res.status(500).json({error: error, message: "Could not edit user's password"}))
});

/* POST users. */
router.post('', async function(req, res, next) {
  try{
    const promises = req.body.map(user => User.addUser(user));
    const data = await Promise.all(promises);
  
    res.status(201).json(data)

  } catch(error) {
    res.status(500).json({error: error, message: "Could not insert the user."})
  }
});

/* Validate file. */
// input: [{email: "email", role: role}]
router.post('/validate', async function(req, res, next) {
  const data = [];
  const errors = [];

  // Cria um array de Promises
  const promises = req.body["students"].map(async function(user) {
    try {
      const result = await User.getUserByEmail(user);      
      // Verifica se o role do utilizador é igual ao role do ficheiro
      if(result == null){
        errors.push({ message: "The user does not exist", user: user });
        console.log("The user does not exist")
      }
      else {  
        data.push(user);
      }

    } catch (error) {
      errors.push({ message: "Could not validate the user", user: user});
      console.log("Could not validate the user")
    }
  });

  // Aguarda a conclusão de todas as Promises
  await Promise.all(promises);

  // Verifica se há erros antes de enviar a resposta
  if (errors.length > 0) {
    res.status(500).json(errors);
  } else {
    res.status(201).json({"successful": true});
  }
});

module.exports = router;
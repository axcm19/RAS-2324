var jwt = require('jsonwebtoken');

// Ex: roles = {'admin': -1, 'producer': 1, 'consumer': -1}
exports.verificaToken = function(req, res, next){
    const myToken = req.query.secret_token
    if(myToken){
        jwt.verify(myToken, process.env.SECRET_KEY, function(e, payload){
          if(e){
            console.log(e)
            res.status(401).jsonp({error: e})
          }
          else{
            next()
          }
        })
      }
      else{
        res.status(401).jsonp({error: "Token inexistente!"})
      }
  }
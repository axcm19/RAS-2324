const { response } = require('../app')
var User = require('../models/user')

// ... Example:
/*
module.exports.list = () => {
    return User
        .find({})
        .sort('name')
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}
*/

// Adds a new user to the users collection
module.exports.addUser = user => {
    return User.create(user)
                    .then(response => {
                        return response
                    })
                    .catch(error => {
                        console.log(error)
                        return error
                    })
}

// Get a user from the users collection
module.exports.getUser = id => {
    return User.findOne({email:id})
            .then(response => {
                return response
            })
            .catch(error => {
                return error
            })
}

// Gets a user by id email (Maybe remove _id)
module.exports.getUserByEmail = email => {
    return User.findOne({email: email})
    .then(response => {
        return response
    })
    .catch(error => {
        return error
    })
}

// Deletes a user from the users collection
module.exports.deleteUser = userId => {
    return User.deleteOne({_id: userId})
                    .then(response => {
                        return response
                    })
                    .catch(error => {
                        console.log(error)
                        return error
                    })
}

// Edits a user's email inside the users collection
module.exports.editUserEmail = user => {
    return User.updateOne({email:user.email}, user)
            .then(response => {
                return response
            })
            .catch(error => {
                return error
            })
}

// Edits a user's password inside the users collection
module.exports.editUserPassword = user => {
    return User.updateOne({password:user.password}, user)
            .then(response => {
                return response
            })
            .catch(error => {
                return error
            })
}

// Gets role by id email
module.exports.getRole = email => {
    return User.findOne({email: email})
    .then(response => {
        return response.role
    })
    .catch(error => {
        return error
    })
}

// Register a user in the db
module.exports.registerUser = (user, password, cb) => {
    console.log(user)
    try {
        User.register(user, password, cb)
    } catch (err) {
        console.log(err)
    }
}
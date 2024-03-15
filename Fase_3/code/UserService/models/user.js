const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt'); // To hash user passwords

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: String,
    role: Number // 0 - student, 1 - teacher, 2 - technician
});

// Before the user information is saved in the database, 
// this function will be called
usersSchema.pre(
    'save',
    async function(next) {
      const user = this;
      const hash = await bcrypt.hash(this.password, 10);
  
      this.password = hash;
      next();
    }
);

// Check if the user has the right credentials
usersSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
}

module.exports = mongoose.model('users', usersSchema);
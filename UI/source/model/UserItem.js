const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  },
  reset_password_token: {
    type: String,
    required: false
  },
  reset_password_expires: {
    type: String,
    required: false
  }  
})

const Item = module.exports = mongoose.model('UserModel', UserSchema);

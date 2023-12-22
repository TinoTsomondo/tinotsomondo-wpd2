// user.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true },
  password: String,
  role: String, // Add the role field
  degreeProgram: String, // Add the degreeProgram field
});

// Hash the password before saving to the database
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

// Method to check if the entered password is valid
userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

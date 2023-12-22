const mongoose = require('mongoose');

const menteeSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  degreeProgram: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Mentee', menteeSchema);

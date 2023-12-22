

const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: String,
  expertise: String,
  description: String,
});

module.exports = mongoose.model('Mentor', mentorSchema);

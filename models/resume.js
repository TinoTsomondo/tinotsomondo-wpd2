const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  // Define your resume schema fields here
  filePath: {
    type: String,
    required: true,
  },
  // Add more fields as needed
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;

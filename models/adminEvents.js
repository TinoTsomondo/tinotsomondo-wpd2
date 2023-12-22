// models/Event.js

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Assuming you store the image filename
    required: true,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

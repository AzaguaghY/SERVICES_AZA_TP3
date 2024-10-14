const mongoose = require('mongoose');

// Comment sub-schema
const commentSchema = new mongoose.Schema({
  commentaire: {
    type: String,
    required: true
  },
  auteur: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

// Main message schema
const messageSchema = new mongoose.Schema({
  _id: {
    type: String, // Changed from Number to String for flexibility
    required: true
  },
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  auteur: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  commentaires: [commentSchema] // Array of comment subdocuments
});

// Creating the Message model
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

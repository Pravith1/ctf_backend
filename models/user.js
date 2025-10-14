const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  field: {
    type: String,
    enum: ['admin', 'user'],
    required: true,
    default: 'user'
  },
  email: {
    type: String,
    required: true,
    unique: true,   // no duplicate emails allowed
    lowercase: true, // store in lowercase
    trim: true
  },
  team_name: {
    type: String,
    required: true,
    trim: true,
    unique: true    // no duplicate team names allowed
  },
  password: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  point: {
    type: Number,
    default: 0,
    min: 0
  },
  solved_no: {
    type: Number,
    default: 0,
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

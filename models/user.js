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
    trim: true
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
  difficulty:{
    type:String,
    required:true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('user', userSchema);

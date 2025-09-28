const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  field: {
    type: String,
    enum: ['admin', 'user'],
    required: true,
    default: 'user'
  },
  password: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  roll_no: {
    type: String,
    required: true,
    unique: true
  },
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: false
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ team_id: 1 });

module.exports = mongoose.model('User', userSchema);
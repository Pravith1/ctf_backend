const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  member_count: {
    type: Number,
    default: 0,
    min: 0
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
  }
}, {
  timestamps: true
});

// Virtual to automatically calculate member count
teamSchema.virtual('actualMemberCount').get(function() {
  return this.members ? this.members.length : 0;
});

// Pre-save middleware to update member_count
teamSchema.pre('save', function(next) {
  if (this.members) {
    this.member_count = this.members.length;
  }
  next();
});

// Index for better query performance
teamSchema.index({ point: -1 }); // For leaderboard queries

module.exports = mongoose.model('Team', teamSchema);
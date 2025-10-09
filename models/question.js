const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: false,
    trim: true
  },
  point: {
    type: Number,
    required: true,
    min: 0
  },
  answer: {
    type: String,
    required: true
  },
  solved_count: {
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

// Index for better query performance
questionSchema.index({ categoryId: 1 });
questionSchema.index({ year: 1 });
questionSchema.index({ point: 1 });
questionSchema.index({ solved_count: -1 }); // For popular questions queries

module.exports = mongoose.model('Question', questionSchema);
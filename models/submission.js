const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  iscorrect: {
    type: Boolean,
    required: true,
    default: false
  },
  submitted_answer: {
    type: String,
    required: false // Optional field to store what answer was submitted
  },
  submitted_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure one submission per team per question (if needed)
// Uncomment the line below if you want to prevent multiple submissions per team per question
// submissionSchema.index({ team_id: 1, questions_id: 1 }, { unique: true });

// Index for better query performance
submissionSchema.index({ team_id: 1 });
submissionSchema.index({ questions_id: 1 });
submissionSchema.index({ iscorrect: 1 });
submissionSchema.index({ submitted_at: -1 }); // For recent submissions queries

module.exports = mongoose.model('Submission', submissionSchema);
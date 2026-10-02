const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: '',
    trim: true
  },
  driveDate: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    default: '',
    trim: true
  },
  driveType: {
    type: String,
    enum: ['Campus Drive', 'Beyond Drive', 'Hacktons'],
    default: 'Campus Drive'
  },
  status: {
    type: String,
    enum: [
      'Upcoming',
      'Applied',
      'Shortlisted',
      'Test Completed',
      'Interview',
      'Selected',
      'Rejected',
      'Completed'
    ],
    default: 'Upcoming'
  },
  examStatus: {
    type: String,
    enum: ['Not Completed', 'Completed'],
    default: 'Not Completed'
  },
  driveLink: {
    type: String,
    default: '',
    trim: true
  },
  resumeLink: {
    type: String,
    default: '',
    trim: true
  },
  hacktonName: {
    type: String,
    default: '',
    trim: true
  },
  hacktonHostedFrom: {
    type: String,
    default: '',
    trim: true
  },
  hacktonDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for faster query performance in MongoDB Atlas
driveSchema.index({ createdAt: -1 });
driveSchema.index({ driveDate: 1 });
driveSchema.index({ driveType: 1 });
driveSchema.index({ status: 1 });

module.exports = mongoose.model('Drive', driveSchema);


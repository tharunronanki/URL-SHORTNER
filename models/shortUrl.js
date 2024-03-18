const mongoose = require('mongoose');
const shortId = require('shortid');

// Schema creation
const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true,
    default: shortId.generate
  },
  custom: {
    type: String,
    default: null
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Add a static method to filter by date range
shortUrlSchema.statics.findByDateRange = function(startDate, endDate, callback) {
  // Use mongoose query builder to filter by createdDate
  return this.find({ createdDate: { $gte: startDate, $lte: endDate } }, callback);
};

// Generate custom short URL if provided by the user
shortUrlSchema.pre('save', function(next) {
  if (this.custom && this.isNew) {
    this.short = this.custom;
  }
  next();
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);

const mongoose = require('mongoose');

const soundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  tags: [String],
  files: [
    {
      format: {
        type: String,
        required: true,
        enum: ['mp3', 'wav', 'flac', 'aiff'],
      },
      filePath: {
        type: String,
        required: true,
      },
    },
  ],
  previewPath: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // in seconds
  },
});

module.exports = mongoose.model('Sound', soundSchema);

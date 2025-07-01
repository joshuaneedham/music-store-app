const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  releaseDate: {
    type: Date,
    default: Date.now,
  },
  genre: {
    type: String,
  },
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

module.exports = mongoose.model('Track', trackSchema);

const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    default: Date.now,
  },
  genre: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  tracks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
    },
  ],
  artworkPath: {
    type: String,
  },
});

module.exports = mongoose.model('Album', albumSchema);

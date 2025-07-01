const mongoose = require('mongoose');

const samplePackSchema = new mongoose.Schema({
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
  sounds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sound',
    },
  ],
  previewPath: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
  },
  tags: [String],
});

module.exports = mongoose.model('SamplePack', samplePackSchema);

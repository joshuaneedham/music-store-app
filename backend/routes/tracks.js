const express = require('express');
const router = express.Router();
const Track = require('../models/Track');

// @route   POST api/tracks
// @desc    Create a track
// @access  Private
router.post('/', async (req, res) => {
  const { title, artist, price, description, genre, files, previewPath, duration } = req.body;

  try {
    const newTrack = new Track({
      title,
      artist,
      price,
      description,
      genre,
      files,
      previewPath,
      duration,
    });

    const track = await newTrack.save();
    res.json(track);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tracks
// @desc    Get all tracks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const tracks = await Track.find();
    res.json(tracks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tracks/:id
// @desc    Get single track
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);

    if (!track) {
      return res.status(404).json({ msg: 'Track not found' });
    }

    res.json(track);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Track not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tracks/:id
// @desc    Update a track
// @access  Private
router.put('/:id', async (req, res) => {
  const { title, artist, price, description, genre } = req.body;

  // Build track object
  const trackFields = {};
  if (title) trackFields.title = title;
  if (artist) trackFields.artist = artist;
  if (price) trackFields.price = price;
  if (description) trackFields.description = description;
  if (genre) trackFields.genre = genre;

  try {
    let track = await Track.findById(req.params.id);

    if (!track) return res.status(404).json({ msg: 'Track not found' });

    track = await Track.findByIdAndUpdate(
      req.params.id,
      { $set: trackFields },
      { new: true }
    );

    res.json(track);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/tracks/:id
// @desc    Delete a track
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    let track = await Track.findById(req.params.id);

    if (!track) return res.status(404).json({ msg: 'Track not found' });

    await Track.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Track removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
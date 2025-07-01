const express = require('express');
const router = express.Router();
const Album = require('../models/Album');

// @route   POST api/albums
// @desc    Create an album
// @access  Private
router.post('/', async (req, res) => {
  const { title, artist, releaseDate, genre, price, tracks } = req.body;

  try {
    const newAlbum = new Album({
      title,
      artist,
      releaseDate,
      genre,
      price,
      tracks,
    });

    const album = await newAlbum.save();
    res.json(album);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/albums
// @desc    Get all albums
// @access  Public
router.get('/', async (req, res) => {
  try {
    const albums = await Album.find().populate('tracks');
    res.json(albums);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/albums/:id
// @desc    Get single album
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('tracks');

    if (!album) {
      return res.status(404).json({ msg: 'Album not found' });
    }

    res.json(album);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Album not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/albums/:id
// @desc    Update an album
// @access  Private
router.put('/:id', async (req, res) => {
  const { title, artist, releaseDate, genre, price, tracks } = req.body;

  // Build album object
  const albumFields = {};
  if (title) albumFields.title = title;
  if (artist) albumFields.artist = artist;
  if (releaseDate) albumFields.releaseDate = releaseDate;
  if (genre) albumFields.genre = genre;
  if (price) albumFields.price = price;
  if (tracks) albumFields.tracks = tracks;

  try {
    let album = await Album.findById(req.params.id);

    if (!album) return res.status(404).json({ msg: 'Album not found' });

    album = await Album.findByIdAndUpdate(
      req.params.id,
      { $set: albumFields },
      { new: true }
    );

    res.json(album);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/albums/:id
// @desc    Delete an album
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    let album = await Album.findById(req.params.id);

    if (!album) return res.status(404).json({ msg: 'Album not found' });

    await Album.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Album removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

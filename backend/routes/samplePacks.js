const express = require('express');
const router = express.Router();
const SamplePack = require('../models/SamplePack');

// @route   POST api/samplePacks
// @desc    Create a sample pack
// @access  Private
router.post('/', async (req, res) => {
  const { name, description, price, sounds, genre, tags } = req.body;

  try {
    const newSamplePack = new SamplePack({
      name,
      description,
      price,
      sounds,
      genre,
      tags,
    });

    const samplePack = await newSamplePack.save();
    res.json(samplePack);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/samplePacks
// @desc    Get all sample packs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const samplePacks = await SamplePack.find().populate('sounds');
    res.json(samplePacks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/samplePacks/:id
// @desc    Get single sample pack
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const samplePack = await SamplePack.findById(req.params.id).populate('sounds');

    if (!samplePack) {
      return res.status(404).json({ msg: 'Sample pack not found' });
    }

    res.json(samplePack);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Sample pack not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/samplePacks/:id
// @desc    Update a sample pack
// @access  Private
router.put('/:id', async (req, res) => {
  const { name, description, price, sounds, genre, tags } = req.body;

  // Build sample pack object
  const samplePackFields = {};
  if (name) samplePackFields.name = name;
  if (description) samplePackFields.description = description;
  if (price) samplePackFields.price = price;
  if (sounds) samplePackFields.sounds = sounds;
  if (genre) samplePackFields.genre = genre;
  if (tags) samplePackFields.tags = tags;

  try {
    let samplePack = await SamplePack.findById(req.params.id);

    if (!samplePack) return res.status(404).json({ msg: 'Sample pack not found' });

    samplePack = await SamplePack.findByIdAndUpdate(
      req.params.id,
      { $set: samplePackFields },
      { new: true }
    );

    res.json(samplePack);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/samplePacks/:id
// @desc    Delete a sample pack
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    let samplePack = await SamplePack.findById(req.params.id);

    if (!samplePack) return res.status(404).json({ msg: 'Sample pack not found' });

    await SamplePack.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Sample pack removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

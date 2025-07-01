const express = require('express');
const router = express.Router();
const Sound = require('../models/Sound');

// @route   POST api/sounds
// @desc    Create a sound
// @access  Private
router.post('/', async (req, res) => {
  const { name, description, price, tags, files, previewPath, duration } = req.body;

  try {
    const newSound = new Sound({
      name,
      description,
      price,
      tags,
      files,
      previewPath,
      duration,
    });

    const sound = await newSound.save();
    res.json(sound);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/sounds
// @desc    Get all sounds
// @access  Public
router.get('/', async (req, res) => {
  try {
    const sounds = await Sound.find();
    res.json(sounds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/sounds/:id
// @desc    Get single sound
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const sound = await Sound.findById(req.params.id);

    if (!sound) {
      return res.status(404).json({ msg: 'Sound not found' });
    }

    res.json(sound);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Sound not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/sounds/:id
// @desc    Update a sound
// @access  Private
router.put('/:id', async (req, res) => {
  const { name, description, price, tags } = req.body;

  // Build sound object
  const soundFields = {};
  if (name) soundFields.name = name;
  if (description) soundFields.description = description;
  if (price) soundFields.price = price;
  if (tags) soundFields.tags = tags;

  try {
    let sound = await Sound.findById(req.params.id);

    if (!sound) return res.status(404).json({ msg: 'Sound not found' });

    sound = await Sound.findByIdAndUpdate(
      req.params.id,
      { $set: soundFields },
      { new: true }
    );

    res.json(sound);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/sounds/:id
// @desc    Delete a sound
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    let sound = await Sound.findById(req.params.id);

    if (!sound) return res.status(404).json({ msg: 'Sound not found' });

    await Sound.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Sound removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
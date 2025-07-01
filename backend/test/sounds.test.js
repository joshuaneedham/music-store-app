const request = require('supertest');
const express = require('express');
const soundsRouter = require('../routes/sounds');
const mongoose = require('mongoose');

// Mock the Sound model
jest.mock('../models/Sound', () => {
  const mockSoundInstance = {
    _id: '60d5ec49f8c7a7001c8e4d7e',
    name: 'Test Sound',
    description: 'A test sound',
    price: 1.99,
    tags: ['test', 'mock'],
    files: [{
      format: 'wav',
      filePath: '/uploads/test_sound.wav'
    }],
    previewPath: '/uploads/test_sound_preview.mp3',
    duration: 10,
  };
  mockSoundInstance.save = jest.fn().mockResolvedValue(mockSoundInstance);

  const MockSound = jest.fn(() => mockSoundInstance);
  MockSound.find = jest.fn().mockResolvedValue([mockSoundInstance]);
  MockSound.findById = jest.fn().mockResolvedValue(mockSoundInstance);
  MockSound.findByIdAndUpdate = jest.fn().mockResolvedValue(mockSoundInstance);
  MockSound.findByIdAndRemove = jest.fn().mockResolvedValue({ msg: 'Sound removed' });

  return MockSound;
});

const app = express();
app.use(express.json());
app.use('/sounds', soundsRouter);

describe('Sound API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /sounds should return all sounds', async () => {
    const Sound = require('../models/Sound');
    const res = await request(app).get('/sounds');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7e');
    expect(Sound.find).toHaveBeenCalledTimes(1);
  });

  it('GET /sounds/:id should return a single sound', async () => {
    const Sound = require('../models/Sound');
    const res = await request(app).get('/sounds/60d5ec49f8c7a7001c8e4d7e');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7e');
    expect(Sound.findById).toHaveBeenCalledTimes(1);
    expect(Sound.findById).toHaveBeenCalledWith('60d5ec49f8c7a7001c8e4d7e');
  });

  it('POST /sounds should create a new sound', async () => {
    const Sound = require('../models/Sound');
    const newSoundData = {
      name: 'New Sound',
      description: 'A new test sound',
      price: 2.99,
      tags: ['new', 'test'],
      files: [{
        format: 'mp3',
        filePath: '/uploads/new_sound.mp3'
      }],
      previewPath: '/uploads/new_sound_preview.mp3',
      duration: 15,
    };

    const res = await request(app).post('/sounds').send(newSoundData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7e');
    expect(Sound).toHaveBeenCalledTimes(1);
    const MockSoundInstance = Sound.mock.results[0].value;
    expect(MockSoundInstance.save).toHaveBeenCalledTimes(1);
  });

  it('PUT /sounds/:id should update a sound', async () => {
    const Sound = require('../models/Sound');
    const updatedSoundData = {
      name: 'Updated Sound Name',
      price: 3.50,
    };

    const res = await request(app).put('/sounds/60d5ec49f8c7a7001c8e4d7e').send(updatedSoundData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7e');
    expect(Sound.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    expect(Sound.findByIdAndUpdate).toHaveBeenCalledWith(
      '60d5ec49f8c7a7001c8e4d7e',
      { $set: { name: 'Updated Sound Name', price: 3.5 } },
      { new: true }
    );
  });

  it('DELETE /sounds/:id should delete a sound', async () => {
    const Sound = require('../models/Sound');
    const res = await request(app).delete('/sounds/60d5ec49f8c7a7001c8e4d7e');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ msg: 'Sound removed' });
    expect(Sound.findByIdAndRemove).toHaveBeenCalledTimes(1);
    expect(Sound.findByIdAndRemove).toHaveBeenCalledWith('60d5ec49f8c7a7001c8e4d7e');
  });
});

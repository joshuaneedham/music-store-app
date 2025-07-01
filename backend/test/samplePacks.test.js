const request = require('supertest');
const express = require('express');
const samplePacksRouter = require('../routes/samplePacks');
const mongoose = require('mongoose');

// Mock the Sound model (since SamplePack populates sounds)
jest.mock('../models/Sound', () => {
  const mockSoundInstance = {
    _id: '60d5ec49f8c7a7001c8e4d7c',
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

// Mock the SamplePack model
jest.mock('../models/SamplePack', () => {
  const mockSamplePackInstance = {
    _id: '60d5ec49f8c7a7001c8e4d7d',
    name: 'Test Sample Pack',
    description: 'A test sample pack',
    price: 29.99,
    sounds: ['60d5ec49f8c7a7001c8e4d7c'], // Only store ID here, populate will handle the full object
    genre: 'Test Genre',
    tags: ['drums', 'loops'],
  };
  mockSamplePackInstance.save = jest.fn().mockResolvedValue(mockSamplePackInstance);

  const MockSamplePack = jest.fn(() => mockSamplePackInstance);
  MockSamplePack.find = jest.fn().mockReturnThis(); // For populate
  MockSamplePack.findById = jest.fn().mockReturnThis(); // For populate
  MockSamplePack.populate = jest.fn().mockResolvedValue(mockSamplePackInstance); // Mock populate
  MockSamplePack.findByIdAndUpdate = jest.fn().mockResolvedValue(mockSamplePackInstance);
  MockSamplePack.findByIdAndRemove = jest.fn().mockResolvedValue({ msg: 'Sample pack removed' });

  return MockSamplePack;
});

const app = express();
app.use(express.json());
app.use('/samplePacks', samplePacksRouter);

describe('SamplePack API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /samplePacks should return all sample packs', async () => {
    const SamplePack = require('../models/SamplePack');
    const res = await request(app).get('/samplePacks');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7d');
    expect(SamplePack.find).toHaveBeenCalledTimes(1);
    expect(SamplePack.populate).toHaveBeenCalledTimes(1);
  });

  it('GET /samplePacks/:id should return a single sample pack', async () => {
    const SamplePack = require('../models/SamplePack');
    const res = await request(app).get('/samplePacks/60d5ec49f8c7a7001c8e4d7d');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7d');
    expect(SamplePack.findById).toHaveBeenCalledTimes(1);
    expect(SamplePack.findById).toHaveBeenCalledWith('60d5ec49f8c7a7001c8e4d7d');
    expect(SamplePack.populate).toHaveBeenCalledTimes(1);
  });

  it('POST /samplePacks should create a new sample pack', async () => {
    const SamplePack = require('../models/SamplePack');
    const newSamplePackData = {
      name: 'New Sample Pack',
      description: 'A new test sample pack',
      price: 35.00,
      sounds: ['60d5ec49f8c7a7001c8e4d7c'],
      genre: 'Hip Hop',
      tags: ['drums', 'one-shots'],
    };

    const res = await request(app).post('/samplePacks').send(newSamplePackData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7d');
    expect(SamplePack).toHaveBeenCalledTimes(1);
    const MockSamplePackInstance = SamplePack.mock.results[0].value;
    expect(MockSamplePackInstance.save).toHaveBeenCalledTimes(1);
  });

  it('PUT /samplePacks/:id should update a sample pack', async () => {
    const SamplePack = require('../models/SamplePack');
    const updatedSamplePackData = {
      name: 'Updated Sample Pack Name',
      price: 40.00,
    };

    const res = await request(app).put('/samplePacks/60d5ec49f8c7a7001c8e4d7d').send(updatedSamplePackData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7d');
    expect(SamplePack.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    expect(SamplePack.findByIdAndUpdate).toHaveBeenCalledWith(
      '60d5ec49f8c7a7001c8e4d7d',
      { $set: { name: 'Updated Sample Pack Name', price: 40 } },
      { new: true }
    );
  });

  it('DELETE /samplePacks/:id should delete a sample pack', async () => {
    const SamplePack = require('../models/SamplePack');
    const res = await request(app).delete('/samplePacks/60d5ec49f8c7a7001c8e4d7d');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ msg: 'Sample pack removed' });
    expect(SamplePack.findByIdAndRemove).toHaveBeenCalledTimes(1);
    expect(SamplePack.findByIdAndRemove).toHaveBeenCalledWith('60d5ec49f8c7a7001c8e4d7d');
  });
});
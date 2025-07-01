const request = require('supertest');
const express = require('express');
const tracksRouter = require('../routes/tracks');
const mongoose = require('mongoose');

// Mock the Track model
jest.mock('../models/Track', () => {
  const mockTrackInstance = {
    _id: '60d5ec49f8c7a7001c8e4d7a',
    title: 'Test Track',
    artist: 'Test Artist',
    price: 9.99,
    description: 'A test track',
    genre: 'Test Genre',
    files: [{
      format: 'mp3',
      filePath: '/uploads/test.mp3'
    }],
    previewPath: '/uploads/test_preview.mp3',
    duration: 180,
  };
  // Explicitly mock save to return the instance itself
  mockTrackInstance.save = jest.fn().mockResolvedValue(mockTrackInstance);

  const MockTrack = jest.fn(() => mockTrackInstance);
  MockTrack.find = jest.fn().mockResolvedValue([mockTrackInstance]);
  MockTrack.findById = jest.fn().mockResolvedValue(mockTrackInstance);
  MockTrack.findByIdAndUpdate = jest.fn().mockResolvedValue(mockTrackInstance);
  MockTrack.findByIdAndRemove = jest.fn().mockResolvedValue({ msg: 'Track removed' });

  return MockTrack;
});

const app = express();
app.use(express.json());
app.use('/tracks', tracksRouter);

describe('Track API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /tracks should return all tracks', async () => {
    const Track = require('../models/Track'); // Re-require to get the mocked version
    const res = await request(app).get('/tracks');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7a');
    expect(Track.find).toHaveBeenCalledTimes(1);
  });

  it('GET /tracks/:id should return a single track', async () => {
    const Track = require('../models/Track');
    const res = await request(app).get('/tracks/60d5ec49f8c7a7001c8e4d7a');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7a');
    expect(Track.findById).toHaveBeenCalledTimes(1);
    expect(Track.findById).toHaveBeenCalledWith('60d5ec49f8c7a7001c8e4d7a');
  });

  it('POST /tracks should create a new track', async () => {
    const Track = require('../models/Track');
    const newTrackData = {
      title: 'New Track',
      artist: 'New Artist',
      price: 12.99,
      description: 'A new test track',
      genre: 'New Genre',
      files: [{
        format: 'wav',
        filePath: '/uploads/new_test.wav'
      }],
      previewPath: '/uploads/new_test_preview.mp3',
      duration: 240,
    };

    const res = await request(app).post('/tracks').send(newTrackData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7a');
    expect(Track).toHaveBeenCalledTimes(1);
    // Check if save was called on the mocked instance
    const MockTrackInstance = Track.mock.results[0].value;
    expect(MockTrackInstance.save).toHaveBeenCalledTimes(1);
  });

  it('PUT /tracks/:id should update a track', async () => {
    const Track = require('../models/Track');
    const updatedTrackData = {
      title: 'Updated Track Title',
      price: 15.00,
    };

    const res = await request(app).put('/tracks/60d5ec49f8c7a7001c8e4d7a').send(updatedTrackData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7a');
    expect(Track.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    expect(Track.findByIdAndUpdate).toHaveBeenCalledWith(
      '60d5ec49f8c7a7001c8e4d7a',
      { $set: { title: 'Updated Track Title', price: 15 } },
      { new: true }
    );
  });

  it('DELETE /tracks/:id should delete a track', async () => {
    const Track = require('../models/Track');
    const res = await request(app).delete('/tracks/60d5ec49f8c7a7001c8e4d7a');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ msg: 'Track removed' });
    expect(Track.findByIdAndRemove).toHaveBeenCalledTimes(1);
    expect(Track.findByIdAndRemove).toHaveBeenCalledWith('60d5ec49f8c7a7001c8e4d7a');
  });
});

const request = require('supertest');
const express = require('express');
const albumsRouter = require('../routes/albums');
const mongoose = require('mongoose');

// Mock the Track model (since Album populates tracks)
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
  mockTrackInstance.save = jest.fn().mockResolvedValue(mockTrackInstance);

  const MockTrack = jest.fn(() => mockTrackInstance);
  MockTrack.find = jest.fn().mockResolvedValue([mockTrackInstance]);
  MockTrack.findById = jest.fn().mockResolvedValue(mockTrackInstance);
  MockTrack.findByIdAndUpdate = jest.fn().mockResolvedValue(mockTrackInstance);
  MockTrack.findByIdAndRemove = jest.fn().mockResolvedValue({ msg: 'Track removed' });

  return MockTrack;
});

// Mock the Album model
jest.mock('../models/Album', () => {
  const mockAlbumInstance = {
    _id: '60d5ec49f8c7a7001c8e4d7b',
    title: 'Test Album',
    artist: 'Test Artist',
    releaseDate: new Date(),
    genre: 'Test Genre',
    price: 19.99,
    tracks: ['60d5ec49f8c7a7001c8e4d7a'], // Only store ID here, populate will handle the full object
  };
  mockAlbumInstance.save = jest.fn().mockResolvedValue(mockAlbumInstance);

  const MockAlbum = jest.fn(() => mockAlbumInstance);
  MockAlbum.find = jest.fn().mockReturnThis(); // For populate
  MockAlbum.findById = jest.fn().mockReturnThis(); // For populate
  MockAlbum.populate = jest.fn().mockResolvedValue(mockAlbumInstance); // Mock populate
  MockAlbum.findByIdAndUpdate = jest.fn().mockResolvedValue(mockAlbumInstance);
  MockAlbum.findByIdAndRemove = jest.fn().mockResolvedValue({ msg: 'Album removed' });

  return MockAlbum;
});

const app = express();
app.use(express.json());
app.use('/albums', albumsRouter);

describe('Album API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /albums should return all albums', async () => {
    const Album = require('../models/Album');
    const res = await request(app).get('/albums');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7b');
    expect(Album.find).toHaveBeenCalledTimes(1);
    expect(Album.populate).toHaveBeenCalledTimes(1);
  });

  it('GET /albums/:id should return a single album', async () => {
    const Album = require('../models/Album');
    const res = await request(app).get('/albums/60d5ec49f8c7a7001c8e4d7b');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7b');
    expect(Album.findById).toHaveBeenCalledTimes(1);
    expect(Album.findById).toHaveBeenCalledWith('60d5ec49f8c7a7001c8e4d7b');
    expect(Album.populate).toHaveBeenCalledTimes(1);
  });

  it('POST /albums should create a new album', async () => {
    const Album = require('../models/Album');
    const newAlbumData = {
      title: 'New Album',
      artist: 'New Artist',
      price: 25.00,
      tracks: ['60d5ec49f8c7a7001c8e4d7a'],
    };

    const res = await request(app).post('/albums').send(newAlbumData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7b');
    expect(Album).toHaveBeenCalledTimes(1);
    const MockAlbumInstance = Album.mock.results[0].value;
    expect(MockAlbumInstance.save).toHaveBeenCalledTimes(1);
  });

  it('PUT /albums/:id should update an album', async () => {
    const Album = require('../models/Album');
    const updatedAlbumData = {
      title: 'Updated Album Title',
      price: 30.00,
    };

    const res = await request(app).put('/albums/60d5ec49f8c7a7001c8e4d7b').send(updatedAlbumData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '60d5ec49f8c7a7001c8e4d7b');
    expect(Album.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    expect(Album.findByIdAndUpdate).toHaveBeenCalledWith(
      '60d5ec49f8c7a7001c8e4d7b',
      { $set: { title: 'Updated Album Title', price: 30 } },
      { new: true }
    );
  });

  it('DELETE /albums/:id should delete an album', async () => {
    const Album = require('../models/Album');
    const res = await request(app).delete('/albums/60d5ec49f8c7a7001c8e4d7b');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ msg: 'Album removed' });
    expect(Album.findByIdAndRemove).toHaveBeenCalledTimes(1);
    expect(Album.findByIdAndRemove).toHaveBeenCalledWith('60d5ec49f8c7a7001c8e4d7b');
  });
});
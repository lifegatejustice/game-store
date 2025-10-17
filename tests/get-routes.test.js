const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Game = require('../models/Game');
const Character = require('../models/Character');
const Developer = require('../models/Developer');
const Review = require('../models/Review');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGO_URI = mongoUri;
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.create({ oauthId: '1', provider: 'google', email: 'test@example.com', name: 'Test User' });
  await Game.create({ title: 'Test Game', description: 'A test game' });
  await Character.create({ name: 'Test Character', bio: 'A test character' });
  await Developer.create({ name: 'Test Developer', foundedYear: 2000, country: 'USA' });
  await Review.create({ game: (await Game.findOne())._id, user: (await User.findOne())._id, rating: 5, title: 'Great game', body: 'Loved it!' });
});

describe('GET routes', () => {
  test('GET /api/games should return 200 and non-empty array', async () => {
    const response = await request(app).get('/api/games');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/characters should return 200 and non-empty array', async () => {
    const response = await request(app).get('/api/characters');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/developers should return 200 and non-empty array', async () => {
    const response = await request(app).get('/api/developers');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/reviews should return 200 and non-empty array', async () => {
    const response = await request(app).get('/api/reviews');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/users should return 200 and non-empty array', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

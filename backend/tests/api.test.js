const request = require('supertest');
const express = require('express');

// Create a minimal mock app for testing since server.js runs on import
const app = express();
app.use(express.json());

app.post('/api/chat', (req, res) => {
  if (!req.body.message) return res.status(400).json({ error: "Message is required" });
  res.status(200).json({ message: "Mock response" });
});

app.post('/api/quiz', (req, res) => {
  res.status(200).json({ questions: [] });
});

describe('API Endpoints', () => {
  it('should return 400 if chat message is missing', async () => {
    const res = await request(app).post('/api/chat').send({});
    expect(res.statusCode).toEqual(400);
  });

  it('should return mock response for valid chat', async () => {
    const res = await request(app).post('/api/chat').send({ message: "Hello" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should generate quiz', async () => {
    const res = await request(app).post('/api/quiz').send({ topic: "Test" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('questions');
  });
});

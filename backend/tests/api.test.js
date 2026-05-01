import { jest } from '@jest/globals';

// Mock the GenAI SDK before importing server
jest.unstable_mockModule('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: '```json\n[{"question": "Mock Q?", "answer": "Mock A."}]\n```'
      })
    }
  }))
}));

// Mock PubSub
jest.unstable_mockModule('@google-cloud/pubsub', () => ({
  PubSub: jest.fn().mockImplementation(() => ({
    topic: jest.fn().mockReturnValue({
      publishMessage: jest.fn().mockResolvedValue('mock-msg-id')
    })
  }))
}));

// Mock BigQuery
jest.unstable_mockModule('@google-cloud/bigquery', () => ({
  BigQuery: jest.fn().mockImplementation(() => ({
    dataset: jest.fn().mockReturnValue({
      table: jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue([])
      })
    })
  }))
}));

// Dynamically import server after mocks are set up
const { default: app } = await import('../server.js');
const { default: request } = await import('supertest');

describe('API Endpoints Testing', () => {

  // --- Health Endpoint ---
  describe('GET /api/health', () => {
    it('should return 200 with status ok and service info', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('services');
      expect(res.body.services).toHaveProperty('gemini');
      expect(res.body.services).toHaveProperty('pubsub');
      expect(res.body.services).toHaveProperty('bigquery');
    });
  });

  // --- Chat Endpoint ---
  describe('POST /api/chat', () => {
    it('should return 400 if message is missing (Validation Test)', async () => {
      const res = await request(app).post('/api/chat').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 if message is empty string', async () => {
      const res = await request(app).post('/api/chat').send({ message: '' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 if message is only whitespace', async () => {
      const res = await request(app).post('/api/chat').send({ message: '   ' });
      expect(res.statusCode).toEqual(400);
    });

    it('should process a valid chat message (Success Test)', async () => {
      const res = await request(app).post('/api/chat').send({ message: "Explain the ECI" });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should handle messages with markdown-like characters without corruption', async () => {
      const res = await request(app).post('/api/chat').send({ message: "What does <ECI> & VVPAT mean?" });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should handle chat with history array', async () => {
      const res = await request(app).post('/api/chat').send({
        message: "Tell me more",
        history: [
          { role: 'user', content: 'What is ECI?' },
          { role: 'model', content: 'ECI is the Election Commission of India.' }
        ]
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should handle malformed history gracefully', async () => {
      const res = await request(app).post('/api/chat').send({
        message: "Hello",
        history: [{ bad: 'data' }, null, 42, { role: 'user', content: 'valid' }]
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
    });
  });

  // --- Flashcards Endpoint ---
  describe('POST /api/flashcards', () => {
    it('should generate flashcards successfully', async () => {
      const res = await request(app).post('/api/flashcards').send({ topic: "Test Topic" });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('flashcards');
      expect(Array.isArray(res.body.flashcards)).toBe(true);
    });

    it('should work without a topic (uses default)', async () => {
      const res = await request(app).post('/api/flashcards').send({});
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('flashcards');
    });
  });

  // --- Quiz Endpoint ---
  describe('POST /api/quiz', () => {
    it('should generate a quiz using context', async () => {
      const context = [{ question: "A", answer: "B" }];
      const res = await request(app).post('/api/quiz').send({ topic: "Test", flashcardsContext: context });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('questions');
    });

    it('should work without context', async () => {
      const res = await request(app).post('/api/quiz').send({});
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('questions');
    });
  });

  // --- Security Tests ---
  describe('Security', () => {
    it('should reject oversized request bodies', async () => {
      const largeMessage = 'A'.repeat(20000); // > 10kb limit
      const res = await request(app).post('/api/chat').send({ message: largeMessage });
      // Express returns 413 for payload too large
      expect([400, 413]).toContain(res.statusCode);
    });
  });

  // --- Catch-all Route ---
  describe('Catch-all route', () => {
    it('should attempt to serve index.html for unknown routes', async () => {
      const res = await request(app).get('/some-unknown-route');
      // Will either return the file or 404 if public/index.html doesn't exist in test env
      expect([200, 404]).toContain(res.statusCode);
    });
  });
});

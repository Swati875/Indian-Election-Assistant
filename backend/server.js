import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import compression from 'compression';
import NodeCache from 'node-cache';
import { findLocalAnswer, getOfflineFlashcards, getOfflineQuiz } from './knowledgeBase.js';
import { PubSub } from '@google-cloud/pubsub';
import { BigQuery } from '@google-cloud/bigquery';

dotenv.config({ override: true });

// --- Structured Logger ---
const log = (level, message, meta = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };
  if (level === 'error') console.error(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Security Hardening & Efficiency ---
// Helmet CSP: allow self-hosted assets in production (required for Cloud Run SPA)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://firestore.googleapis.com", "https://identitytoolkit.googleapis.com"],
    }
  },
  crossOriginEmbedderPolicy: false
}));
app.use(compression()); // Gzip responses for efficiency

// CORS: restrict to known origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGIN || true
    : true,
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body size limit to prevent payload abuse
app.use(express.json({ limit: '10kb' }));

// Trust proxy (Cloud Run sits behind a load balancer)
app.set('trust proxy', 1);

// Rate Limiter to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// In-Memory Cache for efficiency
const quizCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// --- Google Services Integration ---
// Only instantiate Pub/Sub and BigQuery when credentials are available
let pubSubClient = null;
let bigqueryClient = null;
try {
  pubSubClient = new PubSub();
  bigqueryClient = new BigQuery();
  log('info', 'Google Cloud services initialized successfully');
} catch (e) {
  log('warn', 'Google Cloud services unavailable — running without Pub/Sub and BigQuery', { error: e.message });
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// --- Health Check Endpoint ---
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      gemini: !!ai,
      pubsub: !!pubSubClient,
      bigquery: !!bigqueryClient
    }
  });
});

const ELECTION_SYSTEM_PROMPT = `
You are an expert on the Indian Election System. Your goal is to educate users, provide clear explanations about the voting process, timelines, rules (like the Model Code of Conduct), and the roles of different bodies like the Election Commission of India (ECI).
Keep your answers engaging, easy to understand, and politically neutral. Focus on the mechanics and rules of the system.
`;

// --- Helper: Sanitize and validate history array ---
const sanitizeHistory = (history) => {
  if (!Array.isArray(history)) return [];
  return history
    .filter(msg => msg && typeof msg.role === 'string' && typeof msg.content === 'string')
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(msg.content).slice(0, 5000) }] // Limit each message length
    }))
    .slice(-20); // Keep only last 20 messages to prevent token overflow
};

app.post('/api/chat', 
  [
    // .trim() only — .escape() was corrupting markdown characters like <, >, &
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('message').isLength({ max: 2000 }).withMessage('Message too long (max 2000 chars)')
  ],
  async (req, res) => {
    // Input validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { message, history } = req.body;
      
      if (!ai) {
        // Use local knowledge base when no API key
        const localAnswer = findLocalAnswer(message);
        return res.json({ message: localAnswer });
      }

      const formattedHistory = sanitizeHistory(history);

      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [
                ...formattedHistory,
                { role: 'user', parts: [{ text: message }]}
            ],
            config: {
                systemInstruction: ELECTION_SYSTEM_PROMPT
            }
        });
        res.json({ message: response.text });
      } catch (apiError) {
        log('warn', 'Gemini API failed, using local knowledge base', { error: apiError.message });
        const localAnswer = findLocalAnswer(message);
        res.json({ message: localAnswer });
      }
    } catch (error) {
      log('error', 'Chat endpoint failed', { error: error.message });
      const localAnswer = findLocalAnswer(req.body?.message || '');
      return res.json({ message: localAnswer });
    }
});

app.post('/api/flashcards',
  [
    body('topic').optional().trim().escape()
  ],
  async (req, res) => {
    try {
      const topic = req.body.topic || "Indian Election Commission and Voting Process";

      if (!ai) {
        return res.json({ flashcards: getOfflineFlashcards() });
      }

      const prompt = `
Generate 5 flashcards about the ${topic}.
Format the output as a strict JSON array of objects. Do not include markdown code blocks or any other text, just the raw JSON array.
Each object must have:
- "question": The question text
- "answer": A concise answer
      `;

      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        let rawJson = response.text.trim();
        if (rawJson.startsWith('\`\`\`json')) {
            rawJson = rawJson.replace(/\`\`\`json\n?/, '');
            rawJson = rawJson.replace(/\`\`\`$/, '');
        }

        const flashcards = JSON.parse(rawJson);
        res.json({ flashcards });
      } catch (apiError) {
        log('warn', 'Gemini API failed for flashcards, using offline data', { error: apiError.message });
        return res.json({ flashcards: getOfflineFlashcards() });
      }
    } catch (error) {
      log('error', 'Flashcards endpoint failed', { error: error.message });
      return res.json({ flashcards: getOfflineFlashcards() });
    }
  }
);

app.post('/api/quiz', 
  [
    body('topic').optional().trim().escape(),
    body('flashcardsContext').optional().isArray()
  ],
  async (req, res) => {
    try {
      const topic = req.body.topic || "Indian Election System";
      const flashcardsContext = req.body.flashcardsContext;

      if (!ai) {
        return res.json({ questions: getOfflineQuiz() });
      }

      let contextStr = "";
      if (flashcardsContext && flashcardsContext.length > 0) {
        contextStr = "Base the questions strictly on the following flashcards data:\\n";
        contextStr += JSON.stringify(flashcardsContext);
      }

      const quizPrompt = `
Generate 3 to 5 multiple-choice questions about the ${topic}.
${contextStr}
Format the output as a strict JSON array of objects. Do not include markdown code blocks or any other text, just the raw JSON array.
Each object must have:
- "question": The question text
- "options": An array of exactly 4 string options
- "correctAnswer": The exact string of the correct option
- "explanation": A brief explanation of why the answer is correct
      `;

      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: quizPrompt,
        });

        let rawJson = response.text.trim();
        if (rawJson.startsWith('\`\`\`json')) {
            rawJson = rawJson.replace(/\`\`\`json\n?/, '');
            rawJson = rawJson.replace(/\`\`\`$/, '');
        }

        const questions = JSON.parse(rawJson);
        
        // Publish quiz event to Google Pub/Sub (only if credentials are available)
        if (pubSubClient) {
          try {
             const dataBuffer = Buffer.from(JSON.stringify({ event: 'quiz_generated', topic, count: questions.length }));
             pubSubClient.topic('quiz-events').publishMessage({ data: dataBuffer })
              .then(messageId => log('info', 'Pub/Sub message published', { messageId }))
              .catch(err => log('warn', 'Pub/Sub publish skipped', { error: err.message }));
          } catch(e) {
             log('warn', 'Pub/Sub integration failed', { error: e.message });
          }
        }

        res.json({ questions });
      } catch (apiError) {
        log('warn', 'Gemini API failed for quiz, using offline data', { error: apiError.message });
        return res.json({ questions: getOfflineQuiz() });
      }
    } catch (error) {
      log('error', 'Quiz endpoint failed', { error: error.message });
      return res.json({ questions: getOfflineQuiz() });
    }
});

// The "catchall" handler: serve React app for all non-API routes (SPA routing)
app.use((req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If index.html doesn't exist yet (dev environment), return a helpful message
      res.status(200).json({ message: 'Backend is running. Frontend not built yet — run `npm run build` in frontend/' });
    }
  });
});

const PORT = process.env.PORT || 8080;
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, '0.0.0.0', () => {
    log('info', `Backend server running on port ${PORT}`, { port: PORT });
  });

  // Graceful shutdown for Cloud Run (SIGTERM handling)
  process.on('SIGTERM', () => {
    log('info', 'SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      log('info', 'Server closed.');
      process.exit(0);
    });
  });
}

export default app;

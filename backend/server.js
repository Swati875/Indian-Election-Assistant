import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

const ELECTION_SYSTEM_PROMPT = `
You are an expert on the Indian Election System. Your goal is to educate users, provide clear explanations about the voting process, timelines, rules (like the Model Code of Conduct), and the roles of different bodies like the Election Commission of India (ECI).
Keep your answers engaging, easy to understand, and politically neutral. Focus on the mechanics and rules of the system.
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!ai) {
      // Mock response if API key is not present
      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.json({ message: "Hello! I am a mock assistant. To use the real Gemini AI, please provide a `GEMINI_API_KEY` environment variable. But feel free to explore the flashcards and quizzes!" });
    }

    const formattedHistory = history ? history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })) : [];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            ...formattedHistory,
            { role: 'user', parts: [{ text: message }]}
        ],
        config: {
            systemInstruction: ELECTION_SYSTEM_PROMPT
        }
    });

    res.json({ message: response.text });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

app.post('/api/quiz', async (req, res) => {
  try {
    const { topic = "Indian Election System" } = req.body;

    if (!ai) {
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.json({
        questions: [
          {
            question: "What is the minimum voting age in India?",
            options: ["18", "21", "25", "16"],
            correctAnswer: "18",
            explanation: "The minimum voting age in India was reduced from 21 to 18 years by the 61st Constitutional Amendment Act."
          },
          {
            question: "What does EVM stand for?",
            options: ["Electronic Voting Machine", "Election Validation Machine", "Electoral Vote Monitor", "Electronic Voter Module"],
            correctAnswer: "Electronic Voting Machine",
            explanation: "EVMs are used in Indian general and state elections to record votes."
          },
          {
            question: "Which body conducts the Lok Sabha elections in India?",
            options: ["Supreme Court", "Parliament", "Election Commission of India", "President"],
            correctAnswer: "Election Commission of India",
            explanation: "The ECI is an autonomous constitutional authority responsible for administering election processes in India."
          }
        ]
      });
    }

    const quizPrompt = `
Generate 3 multiple-choice questions about the ${topic}.
The questions should vary in difficulty (easy, medium, hard).
Format the output as a strict JSON array of objects. Do not include markdown code blocks or any other text, just the raw JSON array.
Each object must have:
- "question": The question text
- "options": An array of 4 string options
- "correctAnswer": The exact string of the correct option
- "explanation": A brief explanation of why the answer is correct
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: quizPrompt,
    });

    let rawJson = response.text.trim();
    if (rawJson.startsWith('```json')) {
        rawJson = rawJson.replace(/```json\n?/, '');
        rawJson = rawJson.replace(/```$/, '');
    }

    const questions = JSON.parse(rawJson);
    res.json({ questions });

  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Failed to generate quiz questions" });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

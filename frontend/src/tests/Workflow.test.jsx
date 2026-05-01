import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock global fetch
global.fetch = vi.fn((url) => {
  if (url === '/api/chat') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Mock chat response' }),
    });
  }
  if (url === '/api/flashcards') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ flashcards: [{ question: 'Context Q', answer: 'Context A' }] }),
    });
  }
  if (url === '/api/quiz') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ 
        questions: [{ 
          question: 'What is A?', 
          options: ['A', 'B', 'C', 'D'], 
          correctAnswer: 'A',
          explanation: 'Because it is A.'
        }] 
      }),
    });
  }
  return Promise.reject(new Error('not found'));
});

// Mock Web Speech API for the chat component
global.SpeechRecognition = vi.fn();
global.webkitSpeechRecognition = vi.fn();

// Mock Firebase to prevent initialization errors in test
vi.mock('../firebaseConfig', () => ({
  default: {}
}));

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => null),
  collection: vi.fn(),
  addDoc: vi.fn()
}));

describe('End-to-End Workflow Testing', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders the app with correct title and navigation', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/INDIAN ELECTION ASSISTANT/i);
    expect(screen.getByLabelText('Open AI Chat Assistant')).toBeInTheDocument();
    expect(screen.getByLabelText('Open Election Flashcards')).toBeInTheDocument();
    expect(screen.getByLabelText('Play Election Quiz Game')).toBeInTheDocument();
  });

  test('starts on the chat tab by default', () => {
    render(<App />);
    expect(screen.getByLabelText('Chat input field')).toBeInTheDocument();
  });

  test('User can navigate between tabs and perform core workflows', async () => {
    render(<App />);
    
    // 1. Initial render is Chat
    const input = screen.getByLabelText('Chat input field');
    expect(input).toBeInTheDocument();
    
    // Send a message
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByLabelText('Send message'));
    
    await waitFor(() => {
      expect(screen.getByText('Mock chat response')).toBeInTheDocument();
    });

    // 2. Navigate to Flashcards
    fireEvent.click(screen.getByLabelText('Open Election Flashcards'));
    expect(screen.getByText(/Ready to learn/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Generate Flashcards'));
    await waitFor(() => {
      expect(screen.getByText('Context Q')).toBeInTheDocument();
    });

    // 3. Navigate to Quiz Game
    fireEvent.click(screen.getByLabelText('Play Election Quiz Game'));
    expect(screen.getByText(/Generate Quiz & Start/i)).toBeInTheDocument();
    
    // It should display the message that the quiz is contextual now
    expect(screen.getByText(/based on the flashcards you just studied/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Generate Quiz & Start'));
    await waitFor(() => {
      expect(screen.getByText('What is A?')).toBeInTheDocument();
    });

    // Answer the quiz question
    fireEvent.click(screen.getByText('A', { selector: 'button' }));
    
    // Verify feedback
    expect(screen.getByText(/Correct! \+10 Points/i)).toBeInTheDocument();
    
    // Finish Quiz
    fireEvent.click(screen.getByText('View Results'));
    expect(screen.getByText(/Quiz Complete!/i)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('handles chat error gracefully', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));
    
    render(<App />);
    const input = screen.getByLabelText('Chat input field');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByLabelText('Send message'));
    
    await waitFor(() => {
      expect(screen.getByText(/Sorry, I encountered an error/i)).toBeInTheDocument();
    });
  });

  test('Enter key sends a chat message', async () => {
    render(<App />);
    const input = screen.getByLabelText('Chat input field');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/chat', expect.anything());
    });
  });

  test('does not send empty messages', () => {
    render(<App />);
    const sendBtn = screen.getByLabelText('Send message');
    expect(sendBtn).toBeDisabled();
  });
});

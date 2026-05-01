import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import FlashcardDeck from '../components/FlashcardDeck';

// Mock global fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ flashcards: [{ question: 'Q1', answer: 'A1' }] }),
  })
);

describe('FlashcardDeck Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders initial prompt when empty', () => {
    render(<FlashcardDeck cards={[]} setCards={() => {}} />);
    expect(screen.getByText(/Ready to learn/i)).toBeInTheDocument();
  });

  test('shows the generate button when cards are empty', () => {
    render(<FlashcardDeck cards={[]} setCards={() => {}} />);
    expect(screen.getByText(/Generate Flashcards/i)).toBeInTheDocument();
  });

  test('fetches flashcards when generate button is clicked', async () => {
    const setCardsMock = vi.fn();
    render(<FlashcardDeck cards={[]} setCards={setCardsMock} />);
    
    const generateBtn = screen.getByText(/Generate Flashcards/i);
    fireEvent.click(generateBtn);
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/flashcards', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
    
    await waitFor(() => {
      expect(setCardsMock).toHaveBeenCalledWith([{ question: 'Q1', answer: 'A1' }]);
    });
  });

  test('renders card and handles flipping and navigation', () => {
    const mockCards = [{ question: "Q1", answer: "A1" }, { question: "Q2", answer: "A2" }];
    render(<FlashcardDeck cards={mockCards} setCards={() => {}} />);
    
    // Verify card content is displayed
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
    
    // Verify card counter
    expect(screen.getByText(/Card 1 of 2/i)).toBeInTheDocument();
    
    // Test flip via button
    const flipBtn = screen.getByText('Flip Card');
    fireEvent.click(flipBtn);
    
    // Test Next
    const nextBtn = screen.getByLabelText('Next card');
    fireEvent.click(nextBtn);
    
    // Test Previous
    const prevBtn = screen.getByLabelText('Previous card');
    fireEvent.click(prevBtn);
    
    // Verify navigation didn't crash
    expect(nextBtn).toBeInTheDocument();
    expect(prevBtn).toBeInTheDocument();
  });

  test('handles keyboard navigation on flashcard', () => {
    const mockCards = [{ question: "Q1", answer: "A1" }];
    render(<FlashcardDeck cards={mockCards} setCards={() => {}} />);
    
    const flashcardScene = screen.getByLabelText(/Flashcard, click or press enter to flip/i);
    fireEvent.keyDown(flashcardScene, { key: 'Enter' });
    
    // Verify it doesn't crash
    expect(flashcardScene).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));
    const setCardsMock = vi.fn();
    render(<FlashcardDeck cards={[]} setCards={setCardsMock} />);
    
    const generateBtn = screen.getByText(/Generate Flashcards/i);
    fireEvent.click(generateBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to generate flashcards/i)).toBeInTheDocument();
    });
  });

  test('shows try again button on error', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));
    render(<FlashcardDeck cards={[]} setCards={() => {}} />);
    
    fireEvent.click(screen.getByText(/Generate Flashcards/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
    });
  });
});

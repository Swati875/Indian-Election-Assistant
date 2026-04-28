import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FlashcardDeck from '../components/FlashcardDeck';

const mockCards = [
  { id: 1, question: "Q1", answer: "A1" },
  { id: 2, question: "Q2", answer: "A2" }
];

describe('FlashcardDeck Component', () => {
  test('renders without crashing when empty', () => {
    render(<FlashcardDeck cards={[]} />);
    expect(screen.getByText(/No cards available/i)).toBeInTheDocument();
  });

  test('renders first card correctly', () => {
    render(<FlashcardDeck cards={mockCards} />);
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
  });
});

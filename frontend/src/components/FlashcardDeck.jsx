import React, { useState } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';

const FlashcardDeck = ({ cards, setCards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateFlashcards = async () => {
    setLoading(true);
    setError(null);
    setIsFlipped(false);
    setCurrentIndex(0);

    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: "Indian Election System, ECI, Model Code of Conduct" })
      });
      if (!response.ok) throw new Error('Failed to generate flashcards');
      
      const data = await response.json();
      setCards(data.flashcards || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2 className="spinner" size={40} color="var(--color-navy)" />
        <p>AI is crafting unique flashcards for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button className="nav-button active" onClick={generateFlashcards}>Try Again</button>
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="glass-panel text-center p-8">
        <Sparkles size={48} color="var(--color-saffron)" className="mx-auto mb-4" />
        <h2 className="app-subtitle mb-6 text-black">Ready to learn? Generate some AI Flashcards!</h2>
        <button className="nav-button active mx-auto" onClick={generateFlashcards}>
          Generate Flashcards
        </button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flashcard-container">
      <div className="flex justify-between items-center mb-4">
        <div className="text-center flex-1">
          <p className="text-muted">Card {currentIndex + 1} of {cards.length}</p>
          <p className="text-sm mt-1">Click the card to reveal the answer</p>
        </div>
        <button className="control-btn bg-opacity-50" onClick={generateFlashcards} aria-label="Generate new cards">
           <Sparkles size={16} className="mr-1" inline="true" /> New Topic
        </button>
      </div>

      <div className="flashcard-scene" onClick={toggleFlip} onKeyDown={(e) => { if (e.key === 'Enter') toggleFlip(); }} tabIndex={0} aria-label="Flashcard, click or press enter to flip">
        <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
          <div className="flashcard-face flashcard-front glass-panel">
            {currentCard.question}
          </div>
          <div className="flashcard-face flashcard-back glass-panel">
            <RotateCcw size={24} color="var(--color-green)" aria-hidden="true" />
            {currentCard.answer}
          </div>
        </div>
      </div>

      <div className="flashcard-controls">
        <button className="control-btn" onClick={handlePrev} aria-label="Previous card">
          <ChevronLeft size={20} />
        </button>
        <button className="nav-button" onClick={toggleFlip} aria-label="Flip card">
          Flip Card
        </button>
        <button className="control-btn" onClick={handleNext} aria-label="Next card">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck;

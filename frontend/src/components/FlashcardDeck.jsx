import React, { useState } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const FlashcardDeck = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

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

  const currentCard = cards[currentIndex];

  if (!cards || cards.length === 0) return <div>No cards available.</div>;

  return (
    <div className="flashcard-container">
      <div className="text-center mb-4">
        <p className="text-muted">Card {currentIndex + 1} of {cards.length}</p>
        <p className="text-sm mt-1">Click the card to reveal the answer</p>
      </div>

      <div className="flashcard-scene" onClick={toggleFlip}>
        <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
          <div className="flashcard-face flashcard-front glass-panel">
            {currentCard.question}
          </div>
          <div className="flashcard-face flashcard-back glass-panel">
            <RotateCcw size={24} color="var(--color-green)" />
            {currentCard.answer}
          </div>
        </div>
      </div>

      <div className="flashcard-controls">
        <button className="control-btn" onClick={handlePrev}>
          <ChevronLeft size={20} />
        </button>
        <button className="nav-button" onClick={toggleFlip}>
          Flip Card
        </button>
        <button className="control-btn" onClick={handleNext}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck;

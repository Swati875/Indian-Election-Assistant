import React, { useState } from 'react';
import { Loader2, Trophy, RefreshCw } from 'lucide-react';

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [error, setError] = useState(null);

  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedOption(null);

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: "Indian Election System, ECI, Model Code of Conduct, Lok Sabha" }),
      });

      if (!response.ok) throw new Error('Failed to fetch quiz questions');
      
      const data = await response.json();
      setQuestions(data.questions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(option);
    
    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 10);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2 className="spinner" size={40} color="var(--color-navy)" />
        <p>Generating dynamic quiz questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button className="nav-button" onClick={startQuiz}>Try Again</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="glass-panel quiz-setup">
        <Trophy size={48} color="var(--color-saffron)" className="mx-auto mb-4" />
        <h2 className="app-subtitle mb-6 text-black">Test your knowledge on the Indian Election System!</h2>
        <button className="nav-button active mx-auto" onClick={startQuiz}>
          Generate Quiz & Start
        </button>
      </div>
    );
  }

  if (quizFinished) {
    const maxScore = questions.length * 10;
    return (
      <div className="glass-panel quiz-setup">
        <Trophy size={64} color="var(--color-saffron)" className="mx-auto mb-4" />
        <h2 className="app-title mb-2">Quiz Complete!</h2>
        <p className="text-xl mb-6">You scored <strong style={{color: 'var(--color-green)'}}>{score}</strong> out of {maxScore}</p>
        <button className="nav-button active mx-auto" onClick={startQuiz}>
          <RefreshCw size={18} /> Play Again
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const isAnswered = selectedOption !== null;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="text-muted font-medium">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="score-badge">
          Score: {score}
        </div>
      </div>

      <div className="glass-panel question-card">
        <h3 className="question-text">{currentQ.question}</h3>
        
        <div className="options-grid">
          {currentQ.options.map((option, idx) => {
            let className = "option-btn";
            if (isAnswered) {
              if (option === currentQ.correctAnswer) {
                className += " correct";
              } else if (option === selectedOption) {
                className += " incorrect";
              }
            } else if (option === selectedOption) {
              className += " selected";
            }

            return (
              <button 
                key={idx} 
                className={className}
                onClick={() => handleOptionSelect(option)}
                disabled={isAnswered}
              >
                {option}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`feedback-area ${selectedOption === currentQ.correctAnswer ? 'correct' : 'incorrect'}`}>
            <p className="font-semibold mb-1">
              {selectedOption === currentQ.correctAnswer ? 'Correct! +10 Points' : 'Incorrect'}
            </p>
            <p className="text-sm">{currentQ.explanation}</p>
          </div>
        )}

        {isAnswered && (
          <button className="next-btn" onClick={handleNext}>
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizGame;

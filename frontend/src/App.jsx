import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import FlashcardDeck from './components/FlashcardDeck';
import QuizGame from './components/QuizGame';
import { flashcardsData } from './data/knowledgeBase';
import { MessageCircle, Layers, Award } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">Indian Election Assistant</h1>
        <p className="app-subtitle">Learn about the world's largest democracy</p>
      </header>

      <nav className="nav-container" aria-label="Main Navigation">
        <button 
          className={`nav-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
          aria-pressed={activeTab === 'chat'}
          aria-label="Open AI Chat Assistant"
        >
          <MessageCircle size={18} aria-hidden="true" /> Ask AI
        </button>
        <button 
          className={`nav-button ${activeTab === 'flashcards' ? 'active' : ''}`}
          onClick={() => setActiveTab('flashcards')}
          aria-pressed={activeTab === 'flashcards'}
          aria-label="Open Election Flashcards"
        >
          <Layers size={18} aria-hidden="true" /> Flashcards
        </button>
        <button 
          className={`nav-button ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
          aria-pressed={activeTab === 'quiz'}
          aria-label="Play Election Quiz Game"
        >
          <Award size={18} aria-hidden="true" /> Quiz Game
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'chat' && <ChatWindow />}
        {activeTab === 'flashcards' && <FlashcardDeck cards={flashcardsData} />}
        {activeTab === 'quiz' && <QuizGame />}
      </main>
    </>
  );
}

export default App;

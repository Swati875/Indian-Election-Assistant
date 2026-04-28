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

      <nav className="nav-container">
        <button 
          className={`nav-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageCircle size={18} /> Ask AI
        </button>
        <button 
          className={`nav-button ${activeTab === 'flashcards' ? 'active' : ''}`}
          onClick={() => setActiveTab('flashcards')}
        >
          <Layers size={18} /> Flashcards
        </button>
        <button 
          className={`nav-button ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          <Award size={18} /> Quiz Game
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

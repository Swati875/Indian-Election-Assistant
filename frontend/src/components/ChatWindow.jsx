import React, { useState, useRef, useEffect, useCallback } from 'react';
import Message from './Message';
import { Send, Bot, Mic, MicOff } from 'lucide-react';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Namaste! I am your Indian Election Assistant. How can I help you understand the electoral process today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Speech Recognition once via useRef to prevent memory leak
  const recognitionRef = useRef(null);
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English
      recognitionRef.current = recognition;
    }
    return () => {
      // Cleanup on unmount
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) { /* ignore */ }
      }
    };
  }, []);

  const toggleListen = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? prev + ' ' + transcript : transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, [isListening]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          history: messages 
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', content: data.message }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-panel chat-container">
      <div className="chat-messages" aria-live="polite">
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        {isLoading && (
          <div className="message message-bot">
            <div className="message-header">
              <span className="message-sender">Election Assistant</span>
            </div>
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-area">
        <button 
          onClick={toggleListen}
          className={`voice-btn ${isListening ? 'listening' : ''}`}
          aria-label={isListening ? "Stop listening" : "Start speaking"}
          title="Voice Input"
        >
          {isListening ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <input
          type="text"
          className="chat-input has-voice"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={isListening ? "Listening..." : "Ask about EVMs, Voter ID, Model Code of Conduct..."}
          disabled={isLoading}
          aria-label="Chat input field"
          id="chat-input"
        />
        <button 
          className="chat-send-btn" 
          onClick={handleSend}
          disabled={isLoading || (!input.trim() && !isListening)}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

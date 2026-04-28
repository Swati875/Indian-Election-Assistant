import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import { Send, Bot } from 'lucide-react';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Namaste! I am your Indian Election Assistant. How can I help you understand the electoral process today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        {isLoading && (
          <div className="message message-bot">
            <div className="flex items-center gap-2 text-muted">
              <Bot size={18} className="spinner" /> Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about EVMs, Voter ID, Model Code of Conduct..."
          disabled={isLoading}
        />
        <button 
          className="chat-send-btn" 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

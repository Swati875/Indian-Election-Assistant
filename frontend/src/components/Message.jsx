import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Volume2, VolumeX, Copy, Check } from 'lucide-react';

const Message = ({ role, content }) => {
  const isUser = role === 'user';
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Remove markdown for speech
      const textToSpeak = content.replace(/[*_#`~]/g, '');
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-bot'}`}>
      <div className="message-header">
        <span className="message-sender">
          {isUser ? 'You' : 'Election Assistant'}
        </span>
        {!isUser && (
          <div className="message-actions">
            <button 
              onClick={copyToClipboard} 
              className="message-action-btn"
              aria-label={copied ? "Copied!" : "Copy response"}
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <button 
              onClick={toggleSpeech} 
              className="message-action-btn"
              aria-label={isPlaying ? "Stop speaking" : "Read aloud"}
              title={isPlaying ? "Stop speaking" : "Read aloud"}
            >
              {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        )}
      </div>
      <div className="message-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;

import React from 'react';
import ReactMarkdown from 'react-markdown';

const Message = ({ role, content }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`message ${isUser ? 'message-user' : 'message-bot'}`}>
      <div className="font-semibold text-sm mb-1 opacity-80">
        {isUser ? 'You' : 'Election Assistant'}
      </div>
      <div>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;

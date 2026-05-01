import React from 'react';
import './FloatingElements.css';

const FloatingElements = () => {
  const elements = [
    { text: 'VOTE', top: '10%', left: '5%', delay: '0s', size: '1.2rem' },
    { text: 'DEMOCRACY', top: '40%', left: '80%', delay: '2s', size: '1.5rem' },
    { text: 'EVM', top: '70%', left: '10%', delay: '4s', size: '1.8rem' },
    { text: 'ECI', top: '20%', left: '85%', delay: '1s', size: '1.4rem' },
    { text: 'ELECTIONS', top: '80%', left: '75%', delay: '3s', size: '1.3rem' },
    { text: 'CITIZEN', top: '50%', left: '15%', delay: '5s', size: '1.1rem' },
  ];

  return (
    <div className="floating-container" aria-hidden="true">
      {elements.map((el, idx) => (
        <span 
          key={idx} 
          className="floating-word" 
          style={{ 
            top: el.top, 
            left: el.left, 
            animationDelay: el.delay,
            fontSize: el.size
          }}
        >
          {el.text}
        </span>
      ))}
    </div>
  );
};

export default FloatingElements;

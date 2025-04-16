import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const CompletionScreen = ({ score, total, onRestart, onBackToHome }) => {
  const percentage = Math.round((score / total) * 100);
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Different messages based on score
  const getMessage = () => {
    if (percentage >= 90) return "Excellent! You're a master!";
    if (percentage >= 70) return "Great job! You're doing well!";
    if (percentage >= 50) return "Good effort! Keep practicing!";
    return "Keep studying! You'll improve!";
  };
  
  // Motivational quotes
  const quotes = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The only way to learn is to keep practicing and making mistakes.",
    "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    "Learning never exhausts the mind."
  ];
  
  // Randomly select a quote
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  // Only show confetti for good scores
  const showConfetti = percentage >= 70;
  
  return (
    <div className="completion-screen fade-in">
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <h2 className="completion-message">{getMessage()}</h2>
      
      <div className="score">
        {score} / {total} ({percentage}%)
      </div>
      
      <p className="quote">"{randomQuote}"</p>
      
      <div className="controls">
        <button className="nav-button" onClick={onRestart}>
          Try Again
        </button>
        
        <button className="nav-button" onClick={onBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen; 
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const CompletionScreen = ({ score, total, onRestart, onBackToHome, mode }) => {
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
    "Let your memory be as sharp as Daredevil’s senses in Hell’s Kitchen.",
    "If Deadpool can remember all his one-liners, you can handle this material!",
    "As Yoda says: 'Memorize or do not. There is no try.'",
    "Crows can remember faces — so yeah, you’ve got no excuse.",
    "An octopus has 9 brains. You only need one. Use it.",
    "Elephants never forget. Be the elephant.",
    "Dolphins call each other by name. You can at least remember a few terms.",
    "Squirrels remember where they hide thousands of nuts. Surely you can recall this one thing!"
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
          {mode === 'learn' ? 'Review Again' : 'Try Again'}
        </button>
        
        <button className="nav-button" onClick={onBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen; 
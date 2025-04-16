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
    "Remember everything like you're Sherlock Holmes solving a case. Your mind palace awaits!",
    "Memorize this faster than JARVIS processes data. Tony Stark would be proud!",
    "Your memory needs to be as sharp as Daredevil's senses in Hell's Kitchen.",
    "Quick! Memorize this like Doctor Strange reading ancient texts before Dormammu arrives!",
    "Use those brain cells like Captain America uses his shield – with precision and purpose!",
    "As Yoda would say: Memorize or memorize not, there is no try.",
    "Remember everything faster than Spider-Man's spider-sense can detect danger!",
    "If Deadpool can remember all his one-liners, you can remember this material!",
    "Channel your inner Black Panther and let the knowledge of Wakanda flow through you!",
    "The Force of memory is strong with this one. Use it, young Padawan!"
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
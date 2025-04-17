import React, { useState, useEffect } from 'react';

const Flashcard = ({ question, mode, userAnswer, onAnswerSelect, shuffleOptions }) => {
  const [options, setOptions] = useState([]);
  const [optionIndices, setOptionIndices] = useState([]);
  
  // Shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Initialize or shuffle options
  useEffect(() => {
    if (question) {
      if (shuffleOptions) {
        // Create array with original indices and options
        const optionsWithIndices = question.options.map((option, index) => ({
          text: option,
          originalIndex: index
        }));
        
        // Shuffle the options
        const shuffled = shuffleArray(optionsWithIndices);
        
        // Set the shuffled options and keep track of original indices
        setOptions(shuffled.map(item => item.text));
        setOptionIndices(shuffled.map(item => item.originalIndex));
      } else {
        // Just use the original options and indices
        setOptions(question.options);
        setOptionIndices([0, 1, 2, 3]);
      }
    }
  }, [question, shuffleOptions]);
  
  // Convert from shuffled index to original index
  const getOriginalIndex = (shuffledIndex) => {
    return optionIndices[shuffledIndex];
  };
  
  // Determine CSS class for options
  const getOptionClass = (index) => {
    const originalIndex = getOriginalIndex(index);
    const correctIndex = question.correctAnswerIndex;
    
    // Learn mode: Always highlight correct answer
    if (mode === 'learn') {
      return originalIndex === correctIndex ? "option highlighted" : "option";
    }
    
    // Practice and Shuffle modes: Show correct and incorrect after answering
    if (userAnswer !== null) {
      if (originalIndex === correctIndex) {
        return "option correct";
      } else if (index === userAnswer) {
        return "option incorrect";
      }
    }
    
    return "option";
  };
  
  // Handle option click
  const handleOptionClick = (index) => {
    if (userAnswer !== null && mode !== 'learn') return; // Prevent changing answer
    onAnswerSelect(index);
  };
  
  if (!question) return null;
  
  return (
    <div className="flashcard fade-in">
      <div className="question">{question.question}</div>
      
      <div className="options">
        {options.map((option, index) => (
          <div 
            key={index}
            className={getOptionClass(index)}
            onClick={() => handleOptionClick(index)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flashcard; 
import React, { useState, useEffect, useRef } from 'react';

const Flashcard = ({ question, mode, userAnswer, onAnswerSelect, shuffleOptions, onSwipeLeft, onSwipeRight }) => {
  const [options, setOptions] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swiping, setSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const cardRef = useRef(null);
  
  // Min swipe distance (in px) to trigger navigation
  const minSwipeDistance = 100;
  
  // Shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Track original indices when shuffling
  const [optionIndices, setOptionIndices] = useState([]);
  
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
    
    // Reset swipe animation state when question changes
    setSwipeOffset(0);
    setSwipeDirection(null);
    setSwiping(false);
    
    // Show swipe hint for a moment when a new card appears
    setShowSwipeHint(true);
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [question, shuffleOptions]);
  
  // Convert from shuffled index to original index
  const getOriginalIndex = (shuffledIndex) => {
    return optionIndices[shuffledIndex];
  };
  
  // Convert from original index to shuffled index
  const getShuffledIndex = (originalIndex) => {
    return optionIndices.findIndex(index => index === originalIndex);
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
  
  // Touch event handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setSwiping(true);
    setSwipeOffset(0);
  };
  
  const handleTouchMove = (e) => {
    if (!touchStart) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    
    // Set swipe direction for visual feedback
    setSwipeDirection(diff > 0 ? 'right' : 'left');
    
    // Calculate offset for animation (with some resistance)
    const resistance = 0.4; // Lower value = more resistance
    setSwipeOffset(diff * resistance);
    
    // Prevent default to avoid scroll during swipe
    if (Math.abs(diff) > 20) {
      e.preventDefault();
    }
  };
  
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const end = e.changedTouches[0].clientX;
    setTouchEnd(end);
    
    // Calculate swipe distance
    const distance = end - touchStart;
    
    // Process swipe if minimum distance achieved
    if (Math.abs(distance) >= minSwipeDistance) {
      if (distance > 0 && onSwipeRight) {
        // Animate card off screen to the right
        setSwipeOffset(window.innerWidth);
        setTimeout(() => {
          onSwipeRight();
          setSwipeOffset(0);
        }, 300);
      } else if (distance < 0 && onSwipeLeft) {
        // Animate card off screen to the left
        setSwipeOffset(-window.innerWidth);
        setTimeout(() => {
          onSwipeLeft();
          setSwipeOffset(0);
        }, 300);
      }
    } else {
      // Reset if not swiped far enough
      setSwipeOffset(0);
      setTimeout(() => setSwipeDirection(null), 300);
    }
    
    setSwiping(false);
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // Calculate animation styles
  const getCardStyle = () => {
    // During active swipe
    if (swiping) {
      return {
        transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.05}deg)`,
        transition: 'none'
      };
    }
    
    // Returning to center or animating off screen
    if (swipeOffset !== 0) {
      return {
        transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.05}deg)`,
        transition: 'transform 0.3s ease-out'
      };
    }
    
    // Default state
    return { transform: 'translateX(0) rotate(0)', transition: 'transform 0.3s ease-out' };
  };
  
  if (!question) return null;
  
  return (
    <div 
      className={`flashcard fade-in${swiping ? ' swiping' : ''}`}
      ref={cardRef}
      style={getCardStyle()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left swipe indicator */}
      <div 
        className={`swipe-indicator left${swipeDirection === 'left' ? ' active' : ''}${showSwipeHint ? ' hint' : ''}`}
      >
        <div className="arrow-icon">→</div>
        <span className="swipe-text">Next</span>
      </div>
      
      {/* Right swipe indicator */}
      <div 
        className={`swipe-indicator right${swipeDirection === 'right' ? ' active' : ''}${showSwipeHint ? ' hint' : ''}`}
      >
        <span className="swipe-text">Previous</span>
        <div className="arrow-icon">←</div>
      </div>
      
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
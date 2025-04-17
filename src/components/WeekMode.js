import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flashcard from './Flashcard';
import CompletionScreen from './CompletionScreen';

const WeekMode = ({ questions, isAllWeeks = false }) => {
  const { weekId, mode } = useParams();
  const navigate = useNavigate();
  
  // State for tracking questions, current question index, answers, and scores
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  
  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('flashcards-progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);
  
  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(userProgress).length > 0) {
      localStorage.setItem('flashcards-progress', JSON.stringify(userProgress));
    }
  }, [userProgress]);
  
  // Initialize questions based on selected week or all weeks
  useEffect(() => {
    if (questions) {
      let questionsToUse = [];
      
      if (isAllWeeks) {
        // Combine all questions from all weeks
        Object.keys(questions).forEach(weekKey => {
          if (weekKey.includes('weak')) {
            questionsToUse = [...questionsToUse, ...questions[weekKey]];
          }
        });
      } else if (weekId && questions[weekId]) {
        questionsToUse = [...questions[weekId]];
      }
      
      // Shuffle the questions if in shuffle mode
      if (mode === 'shuffle') {
        questionsToUse = shuffleArray([...questionsToUse]);
      }
      
      setCurrentQuestions(questionsToUse);
      setUserAnswers(new Array(questionsToUse.length).fill(null));
      setCurrentIndex(0);
      setScore(0);
      setCompleted(false);
    }
  }, [questions, weekId, isAllWeeks, mode]);
  
  // Function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Update user progress for a question
  const updateQuestionProgress = (questionId, isCorrect) => {
    setUserProgress(prev => {
      const weekKey = isAllWeeks ? 'all-weeks' : weekId;
      const questionKey = `${weekKey}-${questionId}`;
      
      // Get existing data or initialize
      const existingData = prev[questionKey] || {
        attempts: 0,
        correct: 0,
        lastAttempt: null
      };
      
      // Update the data
      const updated = {
        ...existingData,
        attempts: existingData.attempts + 1,
        correct: existingData.correct + (isCorrect ? 1 : 0),
        lastAttempt: new Date().toISOString()
      };
      
      return { ...prev, [questionKey]: updated };
    });
  };
  
  // Handle user answer selection
  const handleAnswerSelect = (selectedIndex) => {
    const currentQuestion = currentQuestions[currentIndex];
    const isCorrect = selectedIndex === currentQuestion.correctAnswerIndex;
    
    // Update answers and score
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentIndex] = selectedIndex;
    setUserAnswers(newUserAnswers);
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Update progress in localStorage
    updateQuestionProgress(currentQuestion.id, isCorrect);
    
    // If in learn mode, automatically move to next question after a delay
    if (mode === 'learn') {
      setTimeout(() => {
        if (currentIndex < currentQuestions.length - 1) {
          setCurrentIndex(prevIndex => prevIndex + 1);
        } else {
          setCompleted(true);
        }
      }, 1000);
    }
  };
  
  // Navigation functions
  const handleNext = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      setCompleted(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswers(new Array(currentQuestions.length).fill(null));
    setScore(0);
    setCompleted(false);
    
    // Shuffle questions again if in shuffle mode
    if (mode === 'shuffle') {
      setCurrentQuestions(shuffleArray([...currentQuestions]));
    }
  };
  
  const handleBackToHome = () => {
    navigate('/');
  };
  
  // Get the progress status for current question
  const getCurrentQuestionProgress = () => {
    if (currentQuestions.length === 0) return null;
    
    const currentQuestion = currentQuestions[currentIndex];
    const weekKey = isAllWeeks ? 'all-weeks' : weekId;
    const questionKey = `${weekKey}-${currentQuestion.id}`;
    
    return userProgress[questionKey] || null;
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentIndex + 1) / currentQuestions.length) * 100;
  
  // Render completion screen if finished
  if (completed) {
    // If in learn mode, show a "Take Test" button instead of the standard completion screen
    if (mode === 'learn') {
      return (
        <div className="completion-screen fade-in">
          <h2 className="completion-message">Great job on reviewing the material!</h2>
          
          <div className="score">
            {score} / {currentQuestions.length} ({Math.round((score / currentQuestions.length) * 100)}%)
          </div>
          
          <p className="quote">Ready to test your knowledge like Sherlock Holmes solves a case?</p>
          
          <div className="controls">
            <button className="nav-button" onClick={() => {
              navigate(`/${isAllWeeks ? 'practice-all' : `week/${weekId}`}/practice`);
            }}>
              Take Test
            </button>
            
            <button className="nav-button" onClick={handleBackToHome}>
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <CompletionScreen 
        score={score}
        total={currentQuestions.length}
        onRestart={handleRestart}
        onBackToHome={handleBackToHome}
        mode={mode}
      />
    );
  }
  
  // Render loading state if questions not loaded yet
  if (currentQuestions.length === 0) {
    return <div className="loading-container">Loading...</div>;
  }
  
  const currentQuestion = currentQuestions[currentIndex];
  const questionProgress = getCurrentQuestionProgress();
  
  return (
    <div className="flashcard-container fade-in">
      <div className="home-button-container">
        <button 
          className="icon-button home-button" 
          onClick={handleBackToHome}
          aria-label="Back to Home"
        >
          🏠
        </button>
      </div>
      
      <div className="progress-text">
        Question {currentIndex + 1} of {currentQuestions.length}
        {questionProgress && (
          <span className="stats-indicator">
            {" "}• Attempts: {questionProgress.attempts} • Correct: {questionProgress.correct}
          </span>
        )}
        {mode === 'learn' && (
          <div className="learn-mode-indicator">
            📚 Learn Mode - Memorize like a superhero!
          </div>
        )}
      </div>
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="flashcard-wrapper">
        <Flashcard 
          question={currentQuestion}
          mode={mode}
          userAnswer={userAnswers[currentIndex]}
          onAnswerSelect={handleAnswerSelect}
          shuffleOptions={mode === 'shuffle'}
        />
      </div>
      
      <div className="floating-controls">
        <button 
          className="floating-button prev-button" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          ◀ Previous
        </button>
        
        <button 
          className="floating-button next-button" 
          onClick={handleNext}
          disabled={mode !== 'learn' && userAnswers[currentIndex] === null}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default WeekMode; 
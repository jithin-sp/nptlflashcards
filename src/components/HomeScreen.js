import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModeSelection from './ModeSelection';

const HomeScreen = ({ questions }) => {
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  
  // Get all week keys from questions object
  const weekKeys = questions ? Object.keys(questions).filter(key => key.includes('weak')) : [];
  
  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('flashcards-progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);
  
  // Calculate progress stats for a week
  const getWeekStats = (weekKey) => {
    if (!questions || !questions[weekKey]) return { completed: 0, total: 0 };
    
    const weekQuestions = questions[weekKey];
    let completed = 0;
    
    weekQuestions.forEach(question => {
      const progressKey = `${weekKey}-${question.id}`;
      if (userProgress[progressKey] && userProgress[progressKey].attempts > 0) {
        completed++;
      }
    });
    
    return {
      completed,
      total: weekQuestions.length,
      percent: Math.round((completed / weekQuestions.length) * 100)
    };
  };
  
  // Handle week selection
  const handleWeekSelect = (weekKey) => {
    setSelectedWeek(weekKey);
  };

  // Reset selection to go back to week list
  const handleBack = () => {
    setSelectedWeek(null);
  };

  return (
    <div className="home-screen fade-in">
      <h1 className="app-title">BI Flashcards</h1>
      
      {selectedWeek ? (
        <>
          <button className="nav-button" onClick={handleBack}>
            ← Back to Weeks
          </button>
          <ModeSelection weekKey={selectedWeek} weekNum={selectedWeek.replace('weak', '')} />
        </>
      ) : (
        <>
                  <div className="practice-all-container">
            <Link to="/practice-all/practice" className="week-button practice-all-button">
              <div className="week-title-text">🔄 Practice All</div>
            </Link>
            <Link to="/practice-all/learn" className="week-button practice-all-button" style={{ marginTop: '0.5rem' }}>
              <div className="week-title-text">📚 Learn All</div>
            </Link>
          </div>
          <div className="week-buttons">
            {weekKeys.map((weekKey, index) => {
              const stats = getWeekStats(weekKey);
              return (
                <button 
                  key={weekKey}
                  className="week-button"
                  onClick={() => handleWeekSelect(weekKey)}
                >
                  <div className="week-title-text">Week {weekKey.replace('weak', '')}</div>
                  <div className="progress-indicator">
                    {stats.completed > 0 ? (
                      <div className="week-progress">
                        Progress: {stats.completed}/{stats.total} ({stats.percent}%)
                      </div>
                    ) : (
                      <div className="week-progress">Not started</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          

        </>
      )}
    </div>
  );
};

export default HomeScreen; 
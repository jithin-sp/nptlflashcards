import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomeScreen from './components/HomeScreen';
import WeekMode from './components/WeekMode';

function App() {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch questions from JSON file
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading questions:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="app">
        <footer className="footer">
          Developed by <a href="https://jithin.tech" target="_blank" rel="noopener noreferrer">Jithin SP</a>
        </footer>
        <div className="loading-container">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <footer className="footer">
          Developed by <a href="https://jithin.tech" target="_blank" rel="noopener noreferrer">Jithin SP</a>
        </footer>
        <Routes>
          <Route path="/" element={<HomeScreen questions={questions} />} />
          <Route path="/week/:weekId/:mode" element={<WeekMode questions={questions} />} />
          <Route path="/practice-all/:mode" element={<WeekMode questions={questions} isAllWeeks={true} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

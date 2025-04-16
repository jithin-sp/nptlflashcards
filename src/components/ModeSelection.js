import React from 'react';
import { Link } from 'react-router-dom';

const ModeSelection = ({ weekKey, weekNum }) => {
  return (
    <div className="mode-selection fade-in">
      <h2 className="mode-title">Week {weekNum} - Select Mode</h2>
      
      <Link to={`/week/${weekKey}/learn`} className="mode-button">
        <div className="mode-title-text">Learn Mode</div>
        <span className="mode-description">
          The correct answer is always visible
        </span>
      </Link>
      
      <Link to={`/week/${weekKey}/practice`} className="mode-button">
        <div className="mode-title-text">Practice Mode</div>
        <span className="mode-description">
          Test yourself with the original question order
        </span>
      </Link>
      
      <Link to={`/week/${weekKey}/shuffle`} className="mode-button">
        <div className="mode-title-text">Shuffle Mode</div>
        <span className="mode-description">
          Random question and answer option order
        </span>
      </Link>
      
    </div>
  );
};

export default ModeSelection; 
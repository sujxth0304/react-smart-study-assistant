import React, { useState, useEffect } from 'react';
import './Pomodoro.css';

const Pomodoro = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
  const [showTips, setShowTips] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            // Play sound when timer ends
            const audio = new Audio('/notification.mp3');
            audio.play();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'pomodoro') setMinutes(25);
    else if (mode === 'shortBreak') setMinutes(5);
    else setMinutes(15);
    setSeconds(0);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'pomodoro') setMinutes(25);
    else if (newMode === 'shortBreak') setMinutes(5);
    else setMinutes(15);
    setSeconds(0);
  };

  const focusTips = [
    "Find a quiet, distraction-free workspace",
    "Put your phone on silent and keep it out of reach",
    "Use noise-cancelling headphones or background white noise",
    "Stay hydrated and keep healthy snacks nearby",
    "Take deep breaths when you feel distracted",
    "Write down distracting thoughts to address later",
    "Break large tasks into smaller, manageable chunks",
    "Set clear goals for each Pomodoro session"
  ];

  return (
    <div className="pomodoro-container">
      <div className="mode-buttons">
        <button 
          className={`mode-btn ${mode === 'pomodoro' ? 'active' : ''}`}
          onClick={() => switchMode('pomodoro')}
        >
          Pomodoro
        </button>
        <button 
          className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => switchMode('shortBreak')}
        >
          Short Break
        </button>
        <button 
          className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => switchMode('longBreak')}
        >
          Long Break
        </button>
      </div>

      <div className="timer">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="timer-controls">
        {!isActive ? (
          <button className="start-btn" onClick={startTimer}>Start</button>
        ) : (
          <button className="pause-btn" onClick={pauseTimer}>Pause</button>
        )}
        <button className="reset-btn" onClick={resetTimer}>Reset</button>
      </div>

      <div className="focus-tips">
        <h3 onClick={() => setShowTips(!showTips)} style={{ cursor: 'pointer' }}>
          Focus Tips {showTips ? '▼' : '▶'}
        </h3>
        {showTips && (
          <ul>
            {focusTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Pomodoro;
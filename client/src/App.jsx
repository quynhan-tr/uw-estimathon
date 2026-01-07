import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboardData = async () => {
    const url = 'https://script.google.com/macros/s/AKfycbwDQMvlOCaQxIg3MxJEAB9Z-8a7k5Exu6IX19OFYrzZ2Y2jTepCKzFd8poVpI8EMWITfA/exec?action=getLeaderboard';
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setLeaderboardData(data);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (leaderboardOpen) {
      fetchLeaderboardData();
      interval = setInterval(fetchLeaderboardData, 30000);
    }
    return () => clearInterval(interval);
  }, [leaderboardOpen]);

  const validateForm = (e) => {
    const formData = new FormData(e.target);
    const groupNumber = formData.get('entry.42548516');
    const email = formData.get('entry.171689670');
    const lowerBound = formData.get('entry.424934828');
    const upperBound = formData.get('entry.342609510');
    const questionNumber = formData.get('entry.1017256989');

    if (isNaN(groupNumber) || !groupNumber.trim()) {
      alert('Please enter a valid group number');
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (isNaN(lowerBound) || isNaN(upperBound) || Number(lowerBound) <= 0 || Number(upperBound) <= 0) {
      alert('Both lower and upper bounds must be positive numbers');
      return false;
    }
    if (Number(lowerBound) > Number(upperBound)) {
      alert('Lower bound must be smaller than upper bound');
      return false;
    }
    if (!groupNumber || !email || !questionNumber || !lowerBound || !upperBound) {
      alert('Please fill out all fields');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    if (!validateForm(e)) {
      e.preventDefault();
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container">
        <div className="confirmation-container">
          <h1>Submission Received!</h1>
          <p>Your guess has been successfully recorded. Good luck!</p>
          <button className="submit-another-button" onClick={() => setSubmitted(false)}>
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <div className="logo">
          <img src="/logo.png" alt="UW DSC Logo" />
          <h1>ESTIMATHON</h1>
        </div>
        <div className="button-container">
          <button className="overlay-button" onClick={() => setRulesOpen(true)}>Rules</button>
          <button className="overlay-button" onClick={() => setLeaderboardOpen(true)}>Leaderboard</button>
        </div>
      </header>
      <main>
        <div className="form-container">
          <h2>Submission</h2>
          <form
            action="https://docs.google.com/forms/d/e/1FAIpQLSdOYqShJsT3OjUO9PW523fWqSAv9G4d5YSxlCSRfYGGacmGTQ/formResponse"
            method="post"
            target="hiddenConfirm"
            onSubmit={handleSubmit}
          >
            <label htmlFor="groupNumber">Group Number</label>
            <input type="text" id="groupNumber" name="entry.42548516" placeholder="Enter group number" />

            <label htmlFor="contactEmail">Contact Email</label>
            <input type="email" id="contactEmail" name="entry.171689670" placeholder="Guesses' results will be sent here" />

            <label>Question Number</label>
            <div className="radio-group">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
                <div className="radio-pair" key={num}>
                  <input type="radio" id={`question${num}`} name="entry.1017256989" value={num} />
                  <label htmlFor={`question${num}`}>{num}</label>
                </div>
              ))}
            </div>

            <label htmlFor="lowerBound">Lower Bound</label>
            <input type="text" id="lowerBound" name="entry.424934828" placeholder="Input positive number" />

            <label htmlFor="upperBound">Upper Bound</label>
            <input type="text" id="upperBound" name="entry.342609510" placeholder="Input positive number" />

            <button type="submit">Submit</button>
          </form>
        </div>
      </main>

      {/* Rules Overlay */}
      <div className={`overlay ${rulesOpen ? 'open' : ''}`} style={{ right: rulesOpen ? '0' : '-100%' }}>
        <div className="rules-content">
          <button className="close-button" onClick={() => setRulesOpen(false)}>Back</button>
          <h2>Overview</h2>
          <p>Your team will have 30 minutes to work on 13 estimation problems. The answer to each problem is a positive number. Your team will submit intervals for each problem. Intervals may not contain negative numbers or zero.</p>
          <h2>Scoring</h2>
          <p>An interval is good if it contains the correct answer. After the 30 minutes is over, the final score for your team will be:</p>
          <img src="/formula.png" alt="Scoring Formula" />
          <p>That is, for every problem you get wrong (or leave blank), your score doubles. The winning team is the team with the LOWEST SCORE.</p>
          <h2>Submitting Intervals</h2>
          <p>Every team can submit up to 18 total intervals. There will be a scoreboard that will be updated in real time based on the intervals that are being submitted.</p>
          <h2>Re-submitting</h2>
          <p>Given that each has 18 answer slips and that there are only 13 problems, it is possible to submit intervals for a given problem more than once. If you do this, only the last submission for any given problem is the one that will count towards your final score. To put it another way: each submission (right or wrong) overrides any previous submissions for a given problem.</p>
        </div>
      </div>

      {/* Leaderboard Overlay */}
      <div className={`overlay ${leaderboardOpen ? 'open' : ''}`} style={{ right: leaderboardOpen ? '0' : '-100%' }}>
        <div className="leaderboard-content">
          <button className="close-button" onClick={() => setLeaderboardOpen(false)}>Back</button>
          <h2>Leaderboard</h2>
          <table id="leaderboardTable">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {loading && leaderboardData.length === 0 ? (
                <tr><td colSpan="3">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="3">{error}</td></tr>
              ) : (
                leaderboardData.map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{team.team}</td>
                    <td>{team.score}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <iframe name="hiddenConfirm" id="hiddenConfirm" style={{ display: 'none' }} />
    </div>
  );
}

export default App;

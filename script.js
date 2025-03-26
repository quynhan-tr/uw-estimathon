// Tracks whether the leaderboard is enabled
var leaderboardEnabled = true;

/******************************************/

// Validate form inputs before submission
function validateForm() {
  var groupNumber = document.querySelector('input[name="entry.42548516"]').value;
  if (isNaN(groupNumber) || groupNumber.trim() === '') {
      alert('Please enter a valid group number');
      return false;
  }
  var email = document.querySelector('input[name="entry.171689670"]').value;
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
      alert('Please enter a valid email address');
      return false;
  }
  var questionNumber = document.querySelector('input[name="entry.1017256989"]:checked');
  var lowerBound = document.querySelector('input[name="entry.424934828"]').value;
  var upperBound = document.querySelector('input[name="entry.342609510"]').value;
  if (isNaN(lowerBound) || isNaN(upperBound) || Number(lowerBound) <= 0 || Number(upperBound) <= 0) {
      alert('Both lower and upper bounds must be positive numbers');
      return false;
  }
  if (Number(lowerBound) > Number(upperBound)) {
      alert('Lower bound must be smaller than upper bound');
      return false;
  }
  if (groupNumber === '' || email === '' || questionNumber === null || lowerBound === '' || upperBound === '') {
      alert('Please fill out all fields');
      return false;
  }
  return true;
}

// Tracks if the form has been submitted
var submitted = false;

// Opens the "Rules" overlay
function openRules() {
  document.getElementById('rulesOverlay').style.right = '0';
}

// Closes the "Rules" overlay
function closeRules() {
  document.getElementById('rulesOverlay').style.right = '-100%';
}

let leaderboardRefreshInterval;

// Opens the "Leaderboard" overlay and starts auto-refreshing the leaderboard
function openLeaderboard() {
  if (!leaderboardEnabled) {
    alert('The leaderboard is currently disabled. Result will be announced soon!');
    return;
  }
  fetchLeaderboardData(); // Fetch leaderboard data
  document.getElementById('leaderboardOverlay').style.right = '0';
  leaderboardRefreshInterval = setInterval(fetchLeaderboardData, 30000); // Refresh every 30 seconds
}

// Closes the "Leaderboard" overlay and stops auto-refreshing the leaderboard
function closeLeaderboard() {
  document.getElementById('leaderboardOverlay').style.right = '-100%';

  // Stop refreshing the leaderboard when the overlay is closed
  clearInterval(leaderboardRefreshInterval);
}

// Fetches leaderboard data from the server and populates the leaderboard table
async function fetchLeaderboardData() {
  const url = 'https://script.google.com/macros/s/AKfycbwDQMvlOCaQxIg3MxJEAB9Z-8a7k5Exu6IX19OFYrzZ2Y2jTepCKzFd8poVpI8EMWITfA/exec?action=getLeaderboard';
  const tableBody = document.querySelector('#leaderboardTable tbody');
  tableBody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>'; // Show loading message

  try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
          tableBody.innerHTML = `<tr><td colspan="3">${data.error}</td></tr>`;
          return;
      }

      // Clear the table and populate it with leaderboard data
      tableBody.innerHTML = '';
      data.forEach((team, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${index + 1}</td>
              <td>${team.team}</td>
              <td>${team.score}</td>
          `;
          tableBody.appendChild(row);
      });
  } catch (error) {
      console.error('Error fetching leaderboard:', error);
      tableBody.innerHTML = '<tr><td colspan="3">Failed to load leaderboard. Please try again later.</td></tr>';
  }
}
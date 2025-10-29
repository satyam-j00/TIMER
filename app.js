// app.js

// Get all our elements
const celestialBody = document.getElementById('celestial-body');
const root = document.documentElement; // This is :root in CSS
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const timerLabel = document.getElementById('timer-label');
const clockDisplay = document.getElementById('clock-display'); // NEW: Get clock element

let timerInterval;
let totalSeconds = 25 * 60; // 25 minutes
let secondsRemaining = totalSeconds;
let isWorkSession = true;
function createStars() {
    removeStars(); // Clear old stars first
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        // Give a random animation delay for better twinkle
        star.style.animationDelay = `${Math.random() * 4}s`; 
        starsContainer.appendChild(star);
    }
}

// NEW: Function to remove stars
function removeStars() {
    starsContainer.innerHTML = '';
}
// NEW: Helper function to format seconds into MM:SS
function formatTime(seconds) {
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSecs = seconds % 60;
    
    // Use padStart to add a leading zero if needed (e.g., 9 -> "09")
    const formattedMins = String(minutes).padStart(2, '0');
    const formattedSecs = String(remainingSecs).padStart(2, '0');
    
    return `${formattedMins}:${formattedSecs}`;
}

// Function to update the UI
function updateUI() {
    // Calculate progress from 0 to 100
    const progress = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;
    
    // Update the CSS variable
    root.style.setProperty('--progress', progress);
}

// Function to start the timer
function startTimer() {
    clearInterval(timerInterval); // Clear any existing timers
    
    timerInterval = setInterval(() => {
        secondsRemaining--;
        updateUI();
        // NEW: Update the clock display every second
        clockDisplay.textContent = formatTime(secondsRemaining);

        if (secondsRemaining <= 0) {
            clearInterval(timerInterval);
            // Timer finished, switch session
            switchSession();
        }
    }, 1000); // Run every second
}

// Function to switch between work and break
function switchSession() {
    isWorkSession = !isWorkSession;
    
    if (isWorkSession) {
        // --- WORK SESSION ---
        timerLabel.textContent = 'Time to focus!';
        totalSeconds = 25 * 60;
        
        // Change CSS variables for the "Day" theme
        root.style.setProperty('--sky-color-top', '#ffcf99'); // Dawn
        root.style.setProperty('--sky-color-bottom', '#f794a0');
        root.style.setProperty('--body-color', '#ffd700'); // Sun
        root.style.setProperty('--body-glow', '#ffc40088');
        removeStars(); // NEW: Remove stars

    } else {
        // --- BREAK SESSION ---
        timerLabel.textContent = 'Time for a break!';
        totalSeconds = 5 * 60;
        
        // Change CSS variables for the "Night" theme
        root.style.setProperty('--sky-color-top', '#3a3d8f'); // Twilight
        root.style.setProperty('--sky-color-bottom', '#1c1c3c'); // Night
        root.style.setProperty('--body-color', '#f4f4f4'); // Moon
        root.style.setProperty('--body-glow', '#ffffff66');
        createStars(); // NEW: Create stars
    }
    
    // Reset timer and start the new session
    secondsRemaining = totalSeconds;
    // NEW: Update clock immediately when switching
    clockDisplay.textContent = formatTime(secondsRemaining);
    
    updateUI(); // Set progress to 0 for the new session
    startTimer();
}

// Function to reset
function reset() {
    clearInterval(timerInterval);
    isWorkSession = true;
    totalSeconds = 25 * 60;
    secondsRemaining = totalSeconds;
    timerLabel.textContent = 'Time to focus!';
    
    // Reset to default "Day" theme
    root.style.setProperty('--sky-color-top', '#ffcf99');
    root.style.setProperty('--sky-color-bottom', '#f794a0');
    root.style.setProperty('--body-color', '#ffd700');
    root.style.setProperty('--body-glow', '#ffc40088');
    root.style.setProperty('--progress', 0);
    removeStars(); // NEW: Clear stars on reset
    startBtn.disabled = false; // NEW: Re-enable start button
    // NEW: Reset the clock display
    clockDisplay.textContent = formatTime(secondsRemaining);
}

// Event Listeners
startBtn.addEventListener('click', () => {
    startBtn.disabled = true; // Prevent multiple clicks
    startTimer();
});

resetBtn.addEventListener('click', () => {
    startBtn.disabled = false;
    reset();
});

// Set initial state
reset();
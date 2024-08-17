document.addEventListener('DOMContentLoaded', () => {
    let wordDict = {};
    let gameWords = [];
    let currentWordIndex = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let startTime;
    let timerRunning = false;

    const fileInput = document.getElementById('fileInput');
    const gameLength = document.getElementById('gameLength');
    const startGameButton = document.getElementById('startGame');
    const submitAnswerButton = document.getElementById('submitAnswer');
    const timerLabel = document.getElementById('timer');
    const resultsText = document.getElementById('results');
    const wordPrompt = document.getElementById('wordPrompt');
    const userInput = document.getElementById('userInput');
    const fileLabel = document.getElementById('fileLabel');
    const fileButton = document.getElementById('fileButton');

    fileInput.addEventListener('change', handleFileSelect);
    startGameButton.addEventListener('click', startGame);
    submitAnswerButton.addEventListener('click', submitAnswer);
    userInput.addEventListener('keydown', handleKeyDown);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = (e) => parseCSV(e.target.result);
            reader.readAsText(file);
            fileLabel.textContent = `File: ${file.name}`;
            fileButton.style.backgroundColor = '#2f4f4f';
            fileButton.style.color = '#ffffff';
        } else {
            alert('Please select a CSV file.');
            fileLabel.textContent = 'No file chosen';
            fileButton.style.backgroundColor = '#495057';
            fileButton.style.color = '#e9ecef';
        }
    }

    function parseCSV(text) {
        wordDict = {};
        text.split('\n').forEach(row => {
            const [word, sound] = row.split(',').map(c => c.trim());
            if (word && sound) {
                wordDict[word] = sound;
            }
        });
        if (Object.keys(wordDict).length > 0) {
            console.log("CSV OK");
        } else {
            alert('CSV file is empty or incorrectly formatted.');
        }
    }

    function startGame() {
        if (Object.keys(wordDict).length === 0) {
            alert('No word data available. Please load a CSV file.');
            return;
        }

        const length = parseInt(gameLength.value);
        gameWords = Array.from({ length }, () => {
            const keys = Object.keys(wordDict);
            return keys[Math.floor(Math.random() * keys.length)];
        });

        correctAnswers = 0;
        incorrectAnswers = 0;
        currentWordIndex = 0;
        resultsText.value = '';
        wordPrompt.textContent = `Word: ${gameWords[currentWordIndex]}`;
        userInput.value = '';

        startTime = new Date();
        timerRunning = true;
        updateTimer();
    }

    function submitAnswer() {
        if (currentWordIndex >= gameWords.length) return;

        const word = gameWords[currentWordIndex];
        const answer = userInput.value.trim().toLowerCase();
        const correctAnswer = wordDict[word].toLowerCase();

        if (answer === correctAnswer) {
            correctAnswers++;
            resultsText.value += `Correct for Word: ${word}\n`;
        } else {
            incorrectAnswers++;
            resultsText.value += `Incorrect for Word: ${word}. Correct answer: ${wordDict[word]}\n`;
        }

        currentWordIndex++;
        if (currentWordIndex < gameWords.length) {
            wordPrompt.textContent = `Word: ${gameWords[currentWordIndex]}`;
            userInput.value = '';
        } else {
            timerRunning = false;
            wordPrompt.textContent = 'Game Over!';
            resultsText.value += `\nGame Over!\nCorrect Answers: ${correctAnswers}\nIncorrect Answers: ${incorrectAnswers}`;
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitAnswer();
        }
    }

    function updateTimer() {
        if (timerRunning) {
            const elapsedTime = Math.floor((new Date() - startTime) / 1000);
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;
            timerLabel.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            setTimeout(updateTimer, 1000);
        }
    }
});

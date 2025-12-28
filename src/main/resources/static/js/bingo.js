let gameInterval;
let gameStarted = false;
let gamePaused = false;
let playerCards = [];

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const playBtn = document.getElementById('playBtn');
    const resetBtn = document.getElementById('resetBtn');
    const cardCountInput = document.getElementById('cardCount');
    const numberSound = document.getElementById('numberSound');
    const letterSound = document.getElementById('letterSound');

    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');

    generateBtn.addEventListener('click', function() {
        console.log('Generate button clicked!');
        generateCards();
    });
    playBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', pauseGame);
    resumeBtn.addEventListener('click', resumeGame);
    resetBtn.addEventListener('click', resetGame);

    function generateCards() {
        const numberOfCards = parseInt(cardCountInput.value);
        console.log('Generating cards:', numberOfCards);
        
        fetch('/generate-cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `numberOfCards=${numberOfCards}`
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Cards data:', data);
            playerCards = data.cards;
            displayCards(data.cards);
            document.querySelector('.setup-controls').style.display = 'none';
            document.querySelector('.game-controls').style.display = 'block';
        })
        .catch(error => {
            console.error('Error generating cards:', error);
        });
    }

    function displayCards(cards) {
        const container = document.getElementById('cardsContainer');
        container.innerHTML = '';
        
        cards.forEach((card, index) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'bingo-card';
            cardDiv.innerHTML = `
                <h3>Card ${index + 1}</h3>
                <table>
                    <thead>
                        <tr><th>B</th><th>I</th><th>N</th><th>G</th><th>O</th></tr>
                    </thead>
                    <tbody>
                        ${card.map((row, rowIndex) => 
                            `<tr>${row.map((cell, colIndex) => {
                                const isFree = rowIndex === 2 && colIndex === 2;
                                const cellClass = isFree ? 'cell called free' : 'cell';
                                const cellValue = isFree ? 'FREE' : cell;
                                return `<td class="${cellClass}" data-card="${index}" data-row="${rowIndex}" data-col="${colIndex}">${cellValue}</td>`;
                            }).join('')}</tr>`
                        ).join('')}
                    </tbody>
                </table>
            `;
            container.appendChild(cardDiv);
        });
    }

    function startGame() {
        if (gameStarted) return;
        
        gameStarted = true;
        gamePaused = false;
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        document.getElementById('calledNumbers').style.display = 'block';
        
        gameInterval = setInterval(callNumber, 3000);
        callNumber();
    }

    function pauseGame() {
        if (!gameStarted || gamePaused) return;
        
        gamePaused = true;
        clearInterval(gameInterval);
        pauseBtn.style.display = 'none';
        resumeBtn.style.display = 'inline-block';
        document.getElementById('currentNumber').textContent = 'Game Paused';
    }

    function resumeGame() {
        if (!gameStarted || !gamePaused) return;
        
        gamePaused = false;
        resumeBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        gameInterval = setInterval(callNumber, 3000);
    }

    function callNumber() {
        fetch('/call-number', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.gameOver) {
                clearInterval(gameInterval);
                document.getElementById('currentNumber').textContent = data.message;
                return;
            }
            
            const letter = getLetterForNumber(data.number);
            document.getElementById('currentNumber').textContent = `${letter}-${data.number}`;
            
            // Play letter sound first, then number sound
            playLetterSound(letter);
            setTimeout(() => {
                playAmharicNumber(data.number);
            }, 800);
            
            // Update called numbers display by letter
            const letterDiv = document.getElementById(`${letter}-numbers`);
            const numberSpan = document.createElement('span');
            numberSpan.textContent = data.number;
            numberSpan.className = 'called-number';
            letterDiv.appendChild(numberSpan);
            
            // Mark called numbers on cards
            markCalledNumber(data.number);
            
            // Check for winners
            if (data.winners && data.winners.length > 0) {
                clearInterval(gameInterval);
                showWinners(data.winners);
            }
        });
    }

    function markCalledNumber(number) {
        document.querySelectorAll('.cell').forEach(cell => {
            if (parseInt(cell.textContent) === number) {
                cell.classList.add('called');
            }
        });
    }

    function showWinners(winners) {
        const winnerAlert = document.getElementById('winnerAlert');
        winnerAlert.innerHTML = `<h2>Winner! Card ${winners.join(', ')} Won!</h2>`;
        winnerAlert.style.display = 'block';
        winnerAlert.className = 'winner-alert';
        
        // Highlight winner cards
        winners.forEach(cardNum => {
            const cards = document.querySelectorAll('.bingo-card');
            if (cards[cardNum - 1]) {
                cards[cardNum - 1].classList.add('winner-card');
            }
        });
    }

    function resetGame() {
        clearInterval(gameInterval);
        gameStarted = false;
        gamePaused = false;
        
        fetch('/reset', {
            method: 'POST'
        })
        .then(() => {
            document.querySelector('.setup-controls').style.display = 'block';
            document.querySelector('.game-controls').style.display = 'none';
            document.getElementById('calledNumbers').style.display = 'none';
            document.getElementById('winnerAlert').style.display = 'none';
            document.getElementById('cardsContainer').innerHTML = '';
            document.getElementById('B-numbers').innerHTML = '';
            document.getElementById('I-numbers').innerHTML = '';
            document.getElementById('N-numbers').innerHTML = '';
            document.getElementById('G-numbers').innerHTML = '';
            document.getElementById('O-numbers').innerHTML = '';
            playBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            resumeBtn.style.display = 'none';
        });
    }
    
    function getLetterForNumber(number) {
        if (number >= 1 && number <= 15) return 'B';
        if (number >= 16 && number <= 30) return 'I';
        if (number >= 31 && number <= 45) return 'N';
        if (number >= 46 && number <= 60) return 'G';
        if (number >= 61 && number <= 75) return 'O';
        return '';
    }
    
    function playLetterSound(letter) {
        // Only use Amharic sound files, no speech synthesis fallback
        const letterSound = `/sounds/letters/amharic-${letter.toLowerCase()}.mp3`;
        const audio = new Audio(letterSound);
        audio.play().catch(e => {
            console.log(`Amharic letter sound not found for ${letter}`);
        });
    }
    
    function speakLetter(letter) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(letter);
            utterance.lang = 'am-ET'; // Amharic language
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            speechSynthesis.speak(utterance);
        }
    }
    
    function playAmharicNumber(number) {
        const amharicNumberSound = `/sounds/numbers/amharic-${number}.aac`;
        console.log(`Playing sound: ${amharicNumberSound} for bingo number ${number}`);
        numberSound.src = amharicNumberSound;
        numberSound.currentTime = 0;
        numberSound.play().then(() => {
            console.log(`Successfully playing ${amharicNumberSound}`);
        }).catch(e => {
            console.log(`Failed to play ${amharicNumberSound}:`, e);
        });
    }
    
    function getAmharicIndexForBingoNumber(bingoNumber) {
        if (bingoNumber >= 1 && bingoNumber <= 15) return bingoNumber;      // B-1 to B-15 → amharic-1 to amharic-15
        if (bingoNumber >= 16 && bingoNumber <= 30) return bingoNumber - 15; // I-16 to I-30 → amharic-1 to amharic-15
        if (bingoNumber >= 31 && bingoNumber <= 45) return bingoNumber - 30; // N-31 to N-45 → amharic-1 to amharic-15
        if (bingoNumber >= 46 && bingoNumber <= 60) return bingoNumber - 45; // G-46 to G-60 → amharic-1 to amharic-15
        if (bingoNumber >= 61 && bingoNumber <= 75) return bingoNumber - 60; // O-61 to O-75 → amharic-1 to amharic-15
        return 1;
    }
    
    function playBeepSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
});
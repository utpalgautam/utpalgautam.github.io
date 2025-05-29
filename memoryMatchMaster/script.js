class MemoryMatchGame {
  constructor() {
    this.gameState = {
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      timer: 0,
      gameStarted: false,
      gamePaused: false,
      currentPlayer: 1,
      scores: { player1: 0, player2: 0 },
      playerNames: { player1: 'Player 1', player2: 'Player 2' },
      gameMode: 'practice',
      difficulty: 'easy',
      theme: 'animals',
      playerMode: 'single',
      customImages: [],
      hintsUsed: 0,
      maxHints: 3
    };

    this.themes = {
      animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦'],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
      symbols: ['⭐', '❤️', '💎', '🔥', '⚡', '🌟', '💫', '🎯', '🎨', '🎭', '🎪', '🎨', '🎲', '🎯', '🎪', '🎭', '🎨', '🎯'],
      emojis: ['😀', '😂', '😍', '🤔', '😎', '🥳', '😴', '🤗', '😇', '🙃', '😋', '🤪', '😊', '😉', '😌', '😏', '🥰', '😘']
    };

    this.difficultySettings = {
      easy: { rows: 3, cols: 4, timeLimit: null },
      medium: { rows: 4, cols: 4, timeLimit: null },
      hard: { rows: 4, cols: 6, timeLimit: 180 },
      expert: { rows: 6, cols: 6, timeLimit: 300 }
    };

    this.sounds = {
      background: null,
      flip: null,
      match: null,
      victory: null
    };

    this.settings = {
      musicEnabled: true,
      soundEnabled: true
    };

    this.timerInterval = null;
    this.init();
  }

  init() {
    this.loadSounds();
    this.bindEvents();
    this.updateUI();
    this.loadSettings();
  }

  loadSounds() {
    this.sounds.background = document.getElementById('background-music');
    this.sounds.flip = document.getElementById('flip-sound');
    this.sounds.match = document.getElementById('match-sound');
    this.sounds.victory = document.getElementById('victory-sound');

    // Set volume levels
    if (this.sounds.background) this.sounds.background.volume = 0.3;
    if (this.sounds.flip) this.sounds.flip.volume = 0.5;
    if (this.sounds.match) this.sounds.match.volume = 0.6;
    if (this.sounds.victory) this.sounds.victory.volume = 0.7;
  }

  loadSettings() {
    const savedSettings = localStorage.getItem('memoryGameSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
    this.updateAudioButtons();
  }

  saveSettings() {
    localStorage.setItem('memoryGameSettings', JSON.stringify(this.settings));
  }

  bindEvents() {
    // Theme selector
    document.getElementById('theme-selector').addEventListener('change', (e) => {
      this.gameState.theme = e.target.value;
      this.toggleCustomUpload();
    });

    // Difficulty selector
    document.getElementById('difficulty-selector').addEventListener('change', (e) => {
      this.gameState.difficulty = e.target.value;
    });

    // Mode selector
    document.getElementById('mode-selector').addEventListener('change', (e) => {
      this.gameState.gameMode = e.target.value;
    });

    // Player mode selector
    document.getElementById('player-mode-selector').addEventListener('change', (e) => {
      this.gameState.playerMode = e.target.value;
      this.toggleMultiplayerUI();
    });

    // Start game button
    document.getElementById('start-game-btn').addEventListener('click', () => {
      this.startGame();
    });

    // Game controls
    document.getElementById('hint-btn').addEventListener('click', () => {
      this.useHint();
    });

    document.getElementById('pause-btn').addEventListener('click', () => {
      this.pauseGame();
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
      this.resetGame();
    });

    // Audio controls
    document.getElementById('music-toggle').addEventListener('click', () => {
      this.toggleMusic();
    });

    document.getElementById('sound-toggle').addEventListener('click', () => {
      this.toggleSound();
    });

    // Modal controls
    document.getElementById('play-again-btn').addEventListener('click', () => {
      this.playAgain();
    });

    document.getElementById('new-game-btn').addEventListener('click', () => {
      this.newGame();
    });

    document.getElementById('close-modal').addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('resume-btn').addEventListener('click', () => {
      this.resumeGame();
    });

    document.getElementById('quit-btn').addEventListener('click', () => {
      this.quitGame();
    });

    // Custom image upload
    const customInput = document.getElementById('custom-images-input');
    const uploadArea = document.getElementById('upload-area');

    customInput.addEventListener('change', (e) => {
      this.handleCustomImages(e.target.files);
    });

    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = 'var(--primary-color)';
    });

    uploadArea.addEventListener('dragleave', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = 'rgba(102, 126, 234, 0.3)';
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = 'rgba(102, 126, 234, 0.3)';
      this.handleCustomImages(e.dataTransfer.files);
    });

    // Player name inputs
    document.getElementById('player1-name').addEventListener('input', (e) => {
      this.gameState.playerNames.player1 = e.target.value || 'Player 1';
    });

    document.getElementById('player2-name').addEventListener('input', (e) => {
      this.gameState.playerNames.player2 = e.target.value || 'Player 2';
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.gameState.gameStarted) {
        e.preventDefault();
        this.pauseGame();
      }
      if (e.code === 'KeyH' && this.gameState.gameStarted && !this.gameState.gamePaused) {
        this.useHint();
      }
      if (e.code === 'KeyR' && this.gameState.gameStarted) {
        this.resetGame();
      }
    });
  }

  toggleCustomUpload() {
    const customUpload = document.getElementById('custom-upload');
    if (this.gameState.theme === 'custom') {
      customUpload.style.display = 'block';
    } else {
      customUpload.style.display = 'none';
    }
  }

  toggleMultiplayerUI() {
    const player2Card = document.getElementById('player2-card');
    const multiplayerElements = document.querySelectorAll('.multiplayer-only');
    
    if (this.gameState.playerMode === 'multiplayer') {
      player2Card.style.display = 'flex';
      multiplayerElements.forEach(el => el.style.display = 'block');
    } else {
      player2Card.style.display = 'none';
      multiplayerElements.forEach(el => el.style.display = 'none');
    }
  }

  handleCustomImages(files) {
    this.gameState.customImages = [];
    const uploadedContainer = document.getElementById('uploaded-images');
    uploadedContainer.innerHTML = '';

    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/') && index < 18) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.gameState.customImages.push(e.target.result);
          
          const imgPreview = document.createElement('div');
          imgPreview.className = 'image-preview';
          imgPreview.innerHTML = `<img src="${e.target.result}" alt="Custom ${index + 1}">`;
          uploadedContainer.appendChild(imgPreview);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  startGame() {
    this.updatePlayerNames();
    this.generateCards();
    this.renderGameBoard();
    this.showGameElements();
    this.startTimer();
    this.gameState.gameStarted = true;
    this.gameState.gamePaused = false;
    this.playBackgroundMusic();
    
    // Add fade-in animation
    document.getElementById('game-board').classList.add('fade-in');
  }

  updatePlayerNames() {
    this.gameState.playerNames.player1 = document.getElementById('player1-name').value || 'Player 1';
    this.gameState.playerNames.player2 = document.getElementById('player2-name').value || 'Player 2';
    
    document.getElementById('player1-name-display').textContent = this.gameState.playerNames.player1;
    document.getElementById('player2-name-display').textContent = this.gameState.playerNames.player2;
    document.getElementById('current-player').textContent = this.gameState.playerNames.player1;
  }

  generateCards() {
    const settings = this.difficultySettings[this.gameState.difficulty];
    const totalCards = settings.rows * settings.cols;
    const pairsNeeded = totalCards / 2;
    
    let symbols = [];
    
    if (this.gameState.theme === 'custom' && this.gameState.customImages.length >= pairsNeeded) {
      symbols = this.gameState.customImages.slice(0, pairsNeeded);
    } else {
      symbols = this.themes[this.gameState.theme].slice(0, pairsNeeded);
    }
    
    // Create pairs
    const cardPairs = [...symbols, ...symbols];
    
    // Shuffle cards
    this.gameState.cards = this.shuffleArray(cardPairs).map((symbol, index) => ({
      id: index,
      symbol: symbol,
      isFlipped: false,
      isMatched: false,
      isCustomImage: this.gameState.theme === 'custom' && this.gameState.customImages.includes(symbol)
    }));
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  renderGameBoard() {
    const gameBoard = document.getElementById('game-board');
    const settings = this.difficultySettings[this.gameState.difficulty];
    
    gameBoard.className = `game-board ${this.gameState.difficulty}`;
    gameBoard.innerHTML = '';
    
    this.gameState.cards.forEach(card => {
      const cardElement = this.createCardElement(card);
      gameBoard.appendChild(cardElement);
    });
  }

  createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.dataset.cardId = card.id;
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-face card-front';
    cardFront.innerHTML = '<i class="fas fa-question"></i>';
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-face card-back';
    
    if (card.isCustomImage) {
      cardBack.innerHTML = `<img src="${card.symbol}" alt="Custom image">`;
    } else {
      cardBack.textContent = card.symbol;
    }
    
    cardDiv.appendChild(cardFront);
    cardDiv.appendChild(cardBack);
    
    cardDiv.addEventListener('click', () => this.flipCard(card.id));
    
    return cardDiv;
  }

  flipCard(cardId) {
    if (!this.gameState.gameStarted || this.gameState.gamePaused) return;
    
    const card = this.gameState.cards[cardId];
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    
    if (card.isFlipped || card.isMatched || this.gameState.flippedCards.length >= 2) return;
    
    card.isFlipped = true;
    cardElement.classList.add('flipped');
    this.gameState.flippedCards.push(card);
    
    this.playSound('flip');
    
    if (this.gameState.flippedCards.length === 2) {
      this.gameState.moves++;
      this.updateStats();
      
      setTimeout(() => this.checkMatch(), 800);
    }
  }

  checkMatch() {
    const [card1, card2] = this.gameState.flippedCards;
    
    if (card1.symbol === card2.symbol) {
      // Match found
      card1.isMatched = true;
      card2.isMatched = true;
      
      const card1Element = document.querySelector(`[data-card-id="${card1.id}"]`);
      const card2Element = document.querySelector(`[data-card-id="${card2.id}"]`);
      
      card1Element.classList.add('matched');
      card2Element.classList.add('matched');
      
      this.gameState.matchedPairs++;
      
      if (this.gameState.playerMode === 'multiplayer') {
        this.gameState.scores[`player${this.gameState.currentPlayer}`]++;
        this.updateMultiplayerScores();
      } else {
        this.gameState.currentPlayer = this.gameState.currentPlayer === 1 ? 2 : 1;
        this.updateCurrentPlayer();
      }
      
      this.playSound('match');
      
      // Check win condition
      if (this.gameState.matchedPairs === this.gameState.cards.length / 2) {
        setTimeout(() => this.gameWon(), 500);
      }
    } else {
      // No match
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        
        const card1Element = document.querySelector(`[data-card-id="${card1.id}"]`);
        const card2Element = document.querySelector(`[data-card-id="${card2.id}"]`);
        
        card1Element.classList.remove('flipped');
        card2Element.classList.remove('flipped');
        
        if (this.gameState.playerMode === 'multiplayer') {
          this.gameState.currentPlayer = this.gameState.currentPlayer === 1 ? 2 : 1;
          this.updateCurrentPlayer();
        }
      }, 1000);
    }
    
    this.gameState.flippedCards = [];
  }

  useHint() {
    if (this.gameState.hintsUsed >= this.gameState.maxHints || !this.gameState.gameStarted || this.gameState.gamePaused) return;
    
    const unflippedCards = this.gameState.cards.filter(card => !card.isFlipped && !card.isMatched);
    if (unflippedCards.length < 2) return;
    
    // Find a matching pair
    for (let i = 0; i < unflippedCards.length; i++) {
      for (let j = i + 1; j < unflippedCards.length; j++) {
        if (unflippedCards[i].symbol === unflippedCards[j].symbol) {
          const card1Element = document.querySelector(`[data-card-id="${unflippedCards[i].id}"]`);
          const card2Element = document.querySelector(`[data-card-id="${unflippedCards[j].id}"]`);
          
          card1Element.classList.add('hint');
          card2Element.classList.add('hint');
          
          setTimeout(() => {
            card1Element.classList.remove('hint');
            card2Element.classList.remove('hint');
          }, 2000);
          
          this.gameState.hintsUsed++;
          this.updateHintButton();
          return;
        }
      }
    }
  }

  updateHintButton() {
    const hintBtn = document.getElementById('hint-btn');
    const remaining = this.gameState.maxHints - this.gameState.hintsUsed;
    hintBtn.innerHTML = `<i class="fas fa-lightbulb"></i> Hint (${remaining})`;
    
    if (remaining === 0) {
      hintBtn.disabled = true;
      hintBtn.style.opacity = '0.5';
    }
  }

  pauseGame() {
    if (!this.gameState.gameStarted) return;
    
    this.gameState.gamePaused = !this.gameState.gamePaused;
    
    if (this.gameState.gamePaused) {
      this.stopTimer();
      this.showModal('pause-modal');
      this.pauseBackgroundMusic();
    } else {
      this.startTimer();
      this.closeModal();
      this.playBackgroundMusic();
    }
  }

  resumeGame() {
    this.gameState.gamePaused = false;
    this.startTimer();
    this.closeModal();
    this.playBackgroundMusic();
  }

  quitGame() {
    this.resetGame();
    this.closeModal();
  }

  resetGame() {
    this.stopTimer();
    this.gameState = {
      ...this.gameState,
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      timer: 0,
      gameStarted: false,
      gamePaused: false,
      currentPlayer: 1,
      scores: { player1: 0, player2: 0 },
      hintsUsed: 0
    };
    
    this.hideGameElements();
    this.updateStats();
    this.updateMultiplayerScores();
    this.stopBackgroundMusic();
    this.closeModal();
  }

  gameWon() {
    this.stopTimer();
    this.gameState.gameStarted = false;
    
    let winnerMessage = '';
    let finalScore = 0;
    
    if (this.gameState.playerMode === 'multiplayer') {
      if (this.gameState.scores.player1 > this.gameState.scores.player2) {
        winnerMessage = `${this.gameState.playerNames.player1} wins!`;
        finalScore = this.gameState.scores.player1;
      } else if (this.gameState.scores.player2 > this.gameState.scores.player1) {
        winnerMessage = `${this.gameState.playerNames.player2} wins!`;
        finalScore = this.gameState.scores.player2;
      } else {
        winnerMessage = "It's a tie!";
        finalScore = this.gameState.scores.player1;
      }
    } else {
      winnerMessage = `${this.gameState.playerNames.player1} completed the game!`;
      finalScore = this.calculateScore();
    }
    
    document.getElementById('winner-message').textContent = winnerMessage;
    document.getElementById('final-time').textContent = this.formatTime(this.gameState.timer);
    document.getElementById('final-moves').textContent = this.gameState.moves;
    document.getElementById('final-score').textContent = finalScore;
    
    this.playSound('victory');
    this.stopBackgroundMusic();
    this.showModal('victory-modal');
    
    // Add victory animation to cards
    document.querySelectorAll('.card').forEach(card => {
      card.style.animation = 'bounce 0.5s infinite alternate';
    });
  }

    calculateScore() {
    const baseScore = 1000;
    const timeBonus = Math.max(0, 300 - this.gameState.timer);
    const movesPenalty = this.gameState.moves * 5;
    const hintPenalty = this.gameState.hintsUsed * 50;
    const difficultyMultiplier = {
      easy: 1,
      medium: 1.5,
      hard: 2,
      expert: 3
    };
    
    const score = Math.max(0, Math.round(
      (baseScore + timeBonus - movesPenalty - hintPenalty) * 
      difficultyMultiplier[this.gameState.difficulty]
    ));
    
    return score;
  }

  playAgain() {
    this.closeModal();
    this.resetGame();
    this.startGame();
  }

  newGame() {
    this.closeModal();
    this.resetGame();
    this.hideGameElements();
  }

  showGameElements() {
    document.getElementById('game-stats').style.display = 'block';
    document.getElementById('game-controls').style.display = 'flex';
    
    if (this.gameState.playerMode === 'multiplayer') {
      document.getElementById('multiplayer-scores').style.display = 'flex';
    }
    
    // Hide configuration elements
    document.querySelector('.game-config').style.display = 'none';
    document.querySelector('.player-setup').style.display = 'none';
    document.getElementById('custom-upload').style.display = 'none';
  }

  hideGameElements() {
    document.getElementById('game-stats').style.display = 'none';
    document.getElementById('game-controls').style.display = 'none';
    document.getElementById('multiplayer-scores').style.display = 'none';
    
    // Show configuration elements
    document.querySelector('.game-config').style.display = 'block';
    document.querySelector('.player-setup').style.display = 'block';
    this.toggleCustomUpload();
    
    // Clear game board
    document.getElementById('game-board').innerHTML = '';
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = setInterval(() => {
      this.gameState.timer++;
      this.updateStats();
      
      // Check time limit for timed modes
      const settings = this.difficultySettings[this.gameState.difficulty];
      if (settings.timeLimit && this.gameState.timer >= settings.timeLimit) {
        this.timeUp();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  timeUp() {
    this.stopTimer();
    this.gameState.gameStarted = false;
    
    document.getElementById('winner-message').textContent = 'Time\'s up! Game over.';
    document.getElementById('final-time').textContent = this.formatTime(this.gameState.timer);
    document.getElementById('final-moves').textContent = this.gameState.moves;
    document.getElementById('final-score').textContent = '0';
    
    this.stopBackgroundMusic();
    this.showModal('victory-modal');
  }

  updateStats() {
    document.getElementById('moves').textContent = this.gameState.moves;
    document.getElementById('timer').textContent = this.formatTime(this.gameState.timer);
    document.getElementById('matches').textContent = this.gameState.matchedPairs;
  }

  updateMultiplayerScores() {
    document.getElementById('player1-score').textContent = this.gameState.scores.player1;
    document.getElementById('player2-score').textContent = this.gameState.scores.player2;
  }

  updateCurrentPlayer() {
    const currentPlayerName = this.gameState.playerNames[`player${this.gameState.currentPlayer}`];
    document.getElementById('current-player').textContent = currentPlayerName;
    
    // Add visual indicator for current player
    document.querySelectorAll('.score-card').forEach(card => {
      card.classList.remove('current-player-active');
    });
    
    const currentPlayerCard = document.querySelector(`.player${this.gameState.currentPlayer}-score`);
    if (currentPlayerCard) {
      currentPlayerCard.classList.add('current-player-active');
    }
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Audio Methods
  toggleMusic() {
    this.settings.musicEnabled = !this.settings.musicEnabled;
    this.updateAudioButtons();
    this.saveSettings();
    
    if (this.settings.musicEnabled && this.gameState.gameStarted && !this.gameState.gamePaused) {
      this.playBackgroundMusic();
    } else {
      this.pauseBackgroundMusic();
    }
  }

  toggleSound() {
    this.settings.soundEnabled = !this.settings.soundEnabled;
    this.updateAudioButtons();
    this.saveSettings();
  }

  updateAudioButtons() {
    const musicBtn = document.getElementById('music-toggle');
    const soundBtn = document.getElementById('sound-toggle');
    
    if (this.settings.musicEnabled) {
      musicBtn.classList.remove('muted');
      musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    } else {
      musicBtn.classList.add('muted');
      musicBtn.innerHTML = '<i class="fas fa-music-slash"></i>';
    }
    
    if (this.settings.soundEnabled) {
      soundBtn.classList.remove('muted');
      soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
      soundBtn.classList.add('muted');
      soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
  }

  playBackgroundMusic() {
    if (this.settings.musicEnabled && this.sounds.background) {
      this.sounds.background.play().catch(e => {
        console.log('Background music play failed:', e);
      });
    }
  }

  pauseBackgroundMusic() {
    if (this.sounds.background) {
      this.sounds.background.pause();
    }
  }

  stopBackgroundMusic() {
    if (this.sounds.background) {
      this.sounds.background.pause();
      this.sounds.background.currentTime = 0;
    }
  }

  playSound(soundName) {
    if (this.settings.soundEnabled && this.sounds[soundName]) {
      this.sounds[soundName].currentTime = 0;
      this.sounds[soundName].play().catch(e => {
        console.log(`Sound ${soundName} play failed:`, e);
      });
    }
  }

  // Modal Methods
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'flex';
    }
  }

  closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('show');
      modal.style.display = 'none';
    });
  }

  // UI Update Methods
  updateUI() {
    this.toggleMultiplayerUI();
    this.toggleCustomUpload();
    this.updateHintButton();
  }

  // Utility Methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Save/Load Game State
  saveGameState() {
    const gameData = {
      ...this.gameState,
      timestamp: Date.now()
    };
    localStorage.setItem('memoryGameState', JSON.stringify(gameData));
  }

  loadGameState() {
    const savedGame = localStorage.getItem('memoryGameState');
    if (savedGame) {
      const gameData = JSON.parse(savedGame);
      // Check if saved game is less than 24 hours old
      if (Date.now() - gameData.timestamp < 24 * 60 * 60 * 1000) {
        return gameData;
      }
    }
    return null;
  }

  // Performance optimization for mobile
  optimizeForMobile() {
    if (window.innerWidth <= 768) {
      // Reduce animation complexity on mobile
      document.documentElement.style.setProperty('--transition-medium', 'all 0.2s ease');
      document.documentElement.style.setProperty('--transition-slow', 'all 0.3s ease');
    }
  }

  // Accessibility improvements
  setupAccessibility() {
    // Add ARIA labels
    document.querySelectorAll('.card').forEach((card, index) => {
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Card ${index + 1}`);
      card.setAttribute('tabindex', '0');
      
      // Add keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // Initialize game statistics
  initializeStats() {
    const stats = {
      gamesPlayed: 0,
      gamesWon: 0,
      bestTime: null,
      bestScore: 0,
      totalMoves: 0
    };
    
    const savedStats = localStorage.getItem('memoryGameStats');
    if (savedStats) {
      return { ...stats, ...JSON.parse(savedStats) };
    }
    return stats;
  }

  updateGameStats(won, time, score, moves) {
    let stats = this.initializeStats();
    
    stats.gamesPlayed++;
    stats.totalMoves += moves;
    
    if (won) {
      stats.gamesWon++;
      if (!stats.bestTime || time < stats.bestTime) {
        stats.bestTime = time;
      }
      if (score > stats.bestScore) {
        stats.bestScore = score;
      }
    }
    
    localStorage.setItem('memoryGameStats', JSON.stringify(stats));
    return stats;
  }

  // Error handling
  handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    
    // Show user-friendly error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'Something went wrong. Please try again.';
    errorMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--danger-gradient);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(errorMessage);
    
    setTimeout(() => {
      errorMessage.remove();
    }, 5000);
  }

  // Cleanup method
  destroy() {
    this.stopTimer();
    this.stopBackgroundMusic();
    
    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeydown);
    
    // Clear any timeouts/intervals
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.memoryGame = new MemoryMatchGame();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Optimize for mobile devices
    if (window.innerWidth <= 768) {
      window.memoryGame.optimizeForMobile();
    }
    
    // Handle window resize
    window.addEventListener('resize', window.memoryGame.debounce(() => {
      window.memoryGame.optimizeForMobile();
    }, 250));
    
    // Handle page visibility change (pause game when tab is not active)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && window.memoryGame.gameState.gameStarted && !window.memoryGame.gameState.gamePaused) {
        window.memoryGame.pauseGame();
      }
    });
    
    // Handle beforeunload (save game state)
    window.addEventListener('beforeunload', () => {
      if (window.memoryGame.gameState.gameStarted) {
        window.memoryGame.saveGameState();
      }
    });
    
  } catch (error) {
    console.error('Failed to initialize Memory Match Game:', error);
  }
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MemoryMatchGame;
}

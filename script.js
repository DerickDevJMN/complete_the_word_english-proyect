/**
 * ========================================================
 * COMPLETE THE WORD - MAIN JAVASCRIPT APPLICATION
 * Interactive Educational English Vocabulary Platform
 * Vanilla JavaScript (ES6+)
 * ========================================================
 */

'use strict';

/* ========================================================
   1. SOUND & SPEECH SYNTHESIS ENGINE (Self-Contained Web Audio)
   ======================================================== */
class SoundEngine {
  constructor() {
    this.enabled = true;
    this.audioCtx = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    } catch (e) {
      this.enabled = false;
    }
  }

  ensureRunning() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playTone(frequency, type, duration, delay = 0, gainLevel = 0.15) {
    if (!this.enabled || !this.audioCtx) return;
    try {
      this.ensureRunning();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime + delay);

      gain.gain.setValueAtTime(gainLevel, this.audioCtx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(this.audioCtx.currentTime + delay);
      osc.stop(this.audioCtx.currentTime + delay + duration);
    } catch (_) {}
  }

  playSuccess() {
    // Happy ascending chord: C5 (523Hz), E5 (659Hz), G5 (784Hz)
    this.playTone(523.25, 'triangle', 0.12, 0, 0.2);
    this.playTone(659.25, 'triangle', 0.14, 0.08, 0.2);
    this.playTone(783.99, 'triangle', 0.25, 0.16, 0.25);
  }

  playError() {
    // Gentle buzzer: 220Hz -> 180Hz
    this.playTone(220, 'sawtooth', 0.22, 0, 0.12);
    this.playTone(180, 'sawtooth', 0.22, 0.1, 0.1);
  }

  playClick() {
    // Subtle UI click
    this.playTone(600, 'sine', 0.05, 0, 0.08);
  }

  playCelebration() {
    // Triumphant victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.28, idx * 0.1, 0.2);
    });
  }

  speak(word) {
    if (!this.enabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop prior audio
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Slightly slower for language learners
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  }
}

const sounds = new SoundEngine();


/* ========================================================
   2. EDUCATIONAL DATASETS (100% ENGLISH FOR BEGINNERS)
   ======================================================== */

/**
 * Game 1: Multiple Choice Quiz Questions (12 Questions)
 */
const QUIZ_DATA = [
  {
    question: "What is the opposite of 'hot'?",
    options: ["Warm", "Cold", "Fast"],
    correctIndex: 1,
    explanation: "'Cold' is the direct opposite of 'hot'. For example: Ice is cold, while fire is hot."
  },
  {
    question: "Which of these animals can fly in the sky?",
    options: ["Elephant", "Bird", "Cat"],
    correctIndex: 1,
    explanation: "A bird has wings and feathers, which allow it to fly in the sky."
  },
  {
    question: "What color do you get when you mix red and white?",
    options: ["Pink", "Green", "Blue"],
    correctIndex: 0,
    explanation: "Mixing red and white creates the color pink."
  },
  {
    question: "Which room in a house do people use to cook meals?",
    options: ["Bedroom", "Kitchen", "Bathroom"],
    correctIndex: 1,
    explanation: "The kitchen is the room equipped with a stove and refrigerator for cooking food."
  },
  {
    question: "How many days are there in one week?",
    options: ["Five", "Seven", "Twelve"],
    correctIndex: 1,
    explanation: "There are 7 days in a week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday."
  },
  {
    question: "What do you drink when you feel thirsty?",
    options: ["Bread", "Water", "Chair"],
    correctIndex: 1,
    explanation: "Water is the essential clear liquid humans drink to quench thirst."
  },
  {
    question: "Which word is a fruit you can eat?",
    options: ["Apple", "Desk", "Pencil"],
    correctIndex: 0,
    explanation: "An apple is a sweet, edible fruit that grows on trees."
  },
  {
    question: "What is the past tense of the verb 'go'?",
    options: ["Went", "Goed", "Gone"],
    correctIndex: 0,
    explanation: "'Went' is the irregular past tense of 'go'. Example: 'Yesterday, I went to school.'"
  },
  {
    question: "Which object do you use to write or draw on paper?",
    options: ["Plate", "Pencil", "Fork"],
    correctIndex: 1,
    explanation: "A pencil is a writing instrument filled with graphite."
  },
  {
    question: "What is the opposite of 'big'?",
    options: ["Small", "Tall", "Heavy"],
    correctIndex: 0,
    explanation: "'Small' means little in size, which is the exact opposite of 'big'."
  },
  {
    question: "What season comes after winter and brings flowers?",
    options: ["Spring", "Summer", "Autumn"],
    correctIndex: 0,
    explanation: "Spring begins after winter; trees grow green leaves and flowers bloom."
  },
  {
    question: "Which item of clothing do you wear on your feet?",
    options: ["Hat", "Shoes", "Gloves"],
    correctIndex: 1,
    explanation: "You wear shoes on your feet to walk and protect them."
  }
];

/**
 * Game 2: Complete the Word Challenges (15 Challenges - Progressive Difficulty)
 */
const COMPLETE_DATA = [
  {
    word: "BOOK",
    display: "B _ O K",
    clue: "You read this object at school or at the library.",
    category: "School & Reading",
    missingLetter: "O"
  },
  {
    word: "APPLE",
    display: "A P P _ E",
    clue: "A delicious fruit that can be red, yellow, or green.",
    category: "Food & Fruit",
    missingLetter: "L"
  },
  {
    word: "WATER",
    display: "W A T _ R",
    clue: "A clear, healthy liquid you drink every single day.",
    category: "Everyday Needs",
    missingLetter: "E"
  },
  {
    word: "CAT",
    display: "C _ T",
    clue: "A small, friendly pet that meows and purrs.",
    category: "Animals",
    missingLetter: "A"
  },
  {
    word: "SUNNY",
    display: "S U _ N Y",
    clue: "Weather when the sun is shining brightly in the blue sky.",
    category: "Weather",
    missingLetter: "N"
  },
  {
    word: "PENCIL",
    display: "P E N _ I L",
    clue: "A wooden tool used for writing notes and drawing pictures.",
    category: "School Objects",
    missingLetter: "C"
  },
  {
    word: "ORANGE",
    display: "O R A _ G E",
    clue: "A sweet citrus fruit and also a bright warm color.",
    category: "Food & Colors",
    missingLetter: "N"
  },
  {
    word: "HOUSE",
    display: "H O _ S E",
    clue: "A building where a family lives together safely.",
    category: "Places",
    missingLetter: "U"
  },
  {
    word: "SCHOOL",
    display: "S C H _ O L",
    clue: "The place where students and teachers meet to learn.",
    category: "Education",
    missingLetter: "O"
  },
  {
    word: "FAMILY",
    display: "F A M _ L Y",
    clue: "A group consisting of parents, children, and close relatives.",
    category: "People",
    missingLetter: "I"
  },
  {
    word: "YELLOW",
    display: "Y E L L _ W",
    clue: "The bright primary color of ripe bananas and the sun.",
    category: "Colors",
    missingLetter: "O"
  },
  {
    word: "TEACHER",
    display: "T E A C _ E R",
    clue: "A person whose job is to help students learn new skills.",
    category: "Professions",
    missingLetter: "H"
  },
  {
    word: "BREAD",
    display: "B R _ A D",
    clue: "A basic baked food made from flour, water, and yeast.",
    category: "Food",
    missingLetter: "E"
  },
  {
    word: "FRIEND",
    display: "F R I _ N D",
    clue: "A person you know well, spend time with, and care about.",
    category: "Relationships",
    missingLetter: "E"
  },
  {
    word: "GARDEN",
    display: "G A R D _ N",
    clue: "An outdoor plot of ground where plants and flowers grow.",
    category: "Nature",
    missingLetter: "E"
  }
];

/**
 * Game 3: Guess the Word Riddles (12 Challenges)
 */
const GUESS_DATA = [
  {
    clue: "I am an animal with four legs and fur. I love to chase balls, and I can bark.",
    answer: "DOG",
    acceptable: ["DOG", "PUPPY"],
    hint: "Begins with the letter 'D' (3 letters)."
  },
  {
    clue: "I shine high in the sky during the daytime and give light and warmth to planet Earth.",
    answer: "SUN",
    acceptable: ["SUN", "THE SUN"],
    hint: "Begins with the letter 'S' (3 letters)."
  },
  {
    clue: "You wear me on your wrist or look at me on a wall to know what time it is.",
    answer: "WATCH",
    acceptable: ["WATCH", "CLOCK"],
    hint: "Starts with 'W' (5 letters). Ticks every second."
  },
  {
    clue: "I am a vehicle with two wheels, handlebars, and pedals that you ride.",
    answer: "BICYCLE",
    acceptable: ["BICYCLE", "BIKE"],
    hint: "Starts with 'B'. Children love riding it in the park."
  },
  {
    clue: "I have paper pages, a colorful cover, and stories or facts printed inside me.",
    answer: "BOOK",
    acceptable: ["BOOK"],
    hint: "Starts with 'B' (4 letters). Rhymes with 'look'."
  },
  {
    clue: "I fall from grey clouds high in the sky in drops of fresh water.",
    answer: "RAIN",
    acceptable: ["RAIN"],
    hint: "Starts with 'R' (4 letters). You need an umbrella when I fall."
  },
  {
    clue: "I am a place with hundreds of tall green trees, wild birds, and hiking trails.",
    answer: "FOREST",
    acceptable: ["FOREST", "WOODS"],
    hint: "Starts with 'F' (6 letters)."
  },
  {
    clue: "I am a sweet, cold dessert made from milk or cream, enjoyed in a cone during summer.",
    answer: "ICE CREAM",
    acceptable: ["ICE CREAM", "ICECREAM"],
    hint: "Two words (or compound). Flavors include chocolate and vanilla."
  },
  {
    clue: "I have 88 black and white keys, but I cannot open any door. I play beautiful musical melodies.",
    answer: "PIANO",
    acceptable: ["PIANO"],
    hint: "Starts with 'P' (5 letters). Famous classical instrument."
  },
  {
    clue: "I am the largest land animal in the world. I have huge ears and a very long trunk.",
    answer: "ELEPHANT",
    acceptable: ["ELEPHANT"],
    hint: "Starts with 'E' (8 letters). Grey color."
  },
  {
    clue: "You put me on your feet to keep them warm and clean before putting on your shoes.",
    answer: "SOCKS",
    acceptable: ["SOCKS", "SOCK"],
    hint: "Starts with 'S' (5 letters). Made of cotton or wool."
  },
  {
    clue: "I am an electronic machine with a screen and keyboard used for homework and browsing the internet.",
    answer: "COMPUTER",
    acceptable: ["COMPUTER", "PC", "LAPTOP"],
    hint: "Starts with 'C' (8 letters)."
  }
];


/* ========================================================
   3. GLOBAL SCORE & STATE CONTROLLER
   ======================================================== */
class AppState {
  constructor() {
    this.totalScore = 0;
    this.activeView = 'home';
    this.loadPersistedScore();
  }

  loadPersistedScore() {
    try {
      const saved = localStorage.getItem('complete_the_word_score');
      if (saved !== null) {
        this.totalScore = parseInt(saved, 10) || 0;
        this.updateHeaderScoreUI();
      }
    } catch (_) {}
  }

  addPoints(points) {
    this.totalScore += points;
    try {
      localStorage.setItem('complete_the_word_score', this.totalScore.toString());
    } catch (_) {}
    this.updateHeaderScoreUI();
  }

  updateHeaderScoreUI() {
    const el = document.getElementById('header-total-score');
    if (el) {
      el.textContent = this.totalScore;
    }
  }

  announceSR(message) {
    const sr = document.getElementById('sr-announcements');
    if (sr) {
      sr.textContent = message;
    }
  }

  getFeedbackMessage(score, maxScore) {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    if (percentage >= 80) {
      return "Excellent! You are improving your English!";
    } else if (percentage >= 50) {
      return "Good job! Keep practicing to improve your vocabulary.";
    } else {
      return "Keep going! Every mistake is an opportunity to learn.";
    }
  }
}

const appState = new AppState();


/* ========================================================
   4. NAVIGATION CONTROLLER
   ======================================================== */
class NavigationController {
  constructor() {
    this.views = {
      home: document.getElementById('view-home'),
      quiz: document.getElementById('view-quiz'),
      complete: document.getElementById('view-complete'),
      guess: document.getElementById('view-guess')
    };

    this.navButtons = document.querySelectorAll('.nav-btn');
    this.bindEvents();
  }

  bindEvents() {
    // Nav links in header
    this.navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.playClick();
        const target = btn.dataset.nav;
        if (target === 'home') {
          this.showView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (target === 'games') {
          this.showView('home');
          const gamesEl = document.getElementById('game-selection');
          if (gamesEl) gamesEl.scrollIntoView({ behavior: 'smooth' });
        } else if (target === 'how-it-works') {
          this.showView('home');
          const howEl = document.getElementById('how-it-works');
          if (howEl) howEl.scrollIntoView({ behavior: 'smooth' });
        }
        this.updateNavHighlight(btn);
      });
    });

    // Logo click returns home
    const logo = document.getElementById('nav-logo');
    if (logo) {
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        sounds.playClick();
        this.showView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Hero buttons
    const heroStartBtn = document.getElementById('hero-start-btn');
    if (heroStartBtn) {
      heroStartBtn.addEventListener('click', () => {
        sounds.playClick();
        const gamesEl = document.getElementById('game-selection');
        if (gamesEl) gamesEl.scrollIntoView({ behavior: 'smooth' });
      });
    }

    const heroLearnBtn = document.getElementById('hero-learn-more-btn');
    if (heroLearnBtn) {
      heroLearnBtn.addEventListener('click', () => {
        sounds.playClick();
        const howEl = document.getElementById('how-it-works');
        if (howEl) howEl.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Return home action buttons in games
    document.querySelectorAll('[data-action="return-home"]').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        this.showView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Sound toggle in header
    const audioBtn = document.getElementById('audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isSoundOn = sounds.toggle();
        const iconOn = audioBtn.querySelector('.sound-on');
        const iconOff = audioBtn.querySelector('.sound-off');
        const label = audioBtn.querySelector('.sound-label');

        if (isSoundOn) {
          iconOn.classList.remove('hidden');
          iconOff.classList.add('hidden');
          label.textContent = "Sound";
          sounds.playClick();
        } else {
          iconOn.classList.add('hidden');
          iconOff.classList.remove('hidden');
          label.textContent = "Muted";
        }
      });
    }

    // Launch game buttons from cards
    document.getElementById('btn-launch-quiz')?.addEventListener('click', () => {
      sounds.playClick();
      quizGame.start();
      this.showView('quiz');
    });

    document.getElementById('btn-launch-complete')?.addEventListener('click', () => {
      sounds.playClick();
      completeGame.start();
      this.showView('complete');
    });

    document.getElementById('btn-launch-guess')?.addEventListener('click', () => {
      sounds.playClick();
      guessGame.start();
      this.showView('guess');
    });

    // Footer link launches
    document.querySelectorAll('[data-launch]').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        const target = btn.dataset.launch;
        if (target === 'quiz') {
          quizGame.start();
          this.showView('quiz');
        } else if (target === 'complete') {
          completeGame.start();
          this.showView('complete');
        } else if (target === 'guess') {
          guessGame.start();
          this.showView('guess');
        }
      });
    });
  }

  showView(viewName) {
    Object.keys(this.views).forEach(key => {
      const el = this.views[key];
      if (el) {
        if (key === viewName) {
          el.classList.add('active');
          el.setAttribute('aria-hidden', 'false');
        } else {
          el.classList.remove('active');
          el.setAttribute('aria-hidden', 'true');
        }
      }
    });
    appState.activeView = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateNavHighlight(activeBtn) {
    this.navButtons.forEach(b => b.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
  }
}


/* ========================================================
   5. GAME 1: MULTIPLE CHOICE QUIZ CONTROLLER
   ======================================================== */
class QuizGame {
  constructor() {
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.hasAnswered = false;

    // DOM Elements
    this.card = document.getElementById('quiz-card');
    this.resultsCard = document.getElementById('quiz-results-card');
    this.questionBadge = document.getElementById('quiz-badge');
    this.questionText = document.getElementById('quiz-question-text');
    this.progressText = document.getElementById('quiz-progress-text');
    this.progressFill = document.getElementById('quiz-progress-fill');
    this.progressBar = document.getElementById('quiz-progress-bar');
    this.scoreDisplay = document.getElementById('quiz-score-display');
    this.feedbackBox = document.getElementById('quiz-feedback-box');
    this.feedbackTitle = document.getElementById('quiz-feedback-title');
    this.feedbackMsg = document.getElementById('quiz-feedback-msg');
    this.feedbackIcon = document.getElementById('quiz-feedback-icon');
    this.nextBtn = document.getElementById('quiz-next-btn');
    this.restartBtn = document.getElementById('quiz-restart-btn');

    this.optionButtons = [
      document.getElementById('quiz-opt-0'),
      document.getElementById('quiz-opt-1'),
      document.getElementById('quiz-opt-2')
    ];

    this.bindEvents();
  }

  bindEvents() {
    this.optionButtons.forEach((btn, index) => {
      btn?.addEventListener('click', () => {
        this.handleAnswerSelection(index);
      });
    });

    this.nextBtn?.addEventListener('click', () => {
      sounds.playClick();
      this.nextQuestion();
    });

    this.restartBtn?.addEventListener('click', () => {
      sounds.playClick();
      this.start();
    });
  }

  start() {
    // Clone questions to avoid mutating original
    this.questions = [...QUIZ_DATA];
    this.currentIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.hasAnswered = false;

    this.card.classList.remove('hidden');
    this.resultsCard.classList.add('hidden');

    this.renderQuestion();
  }

  renderQuestion() {
    this.hasAnswered = false;
    const currentQ = this.questions[this.currentIndex];
    const total = this.questions.length;

    // Header stats update
    this.progressText.textContent = `Question ${this.currentIndex + 1} of ${total}`;
    this.questionBadge.textContent = `Question #${this.currentIndex + 1}`;
    this.scoreDisplay.textContent = this.score;

    // Progress bar update
    const progressPct = ((this.currentIndex + 1) / total) * 100;
    this.progressFill.style.width = `${progressPct}%`;
    this.progressBar.setAttribute('aria-valuenow', Math.round(progressPct));

    // Question text
    this.questionText.textContent = currentQ.question;

    // Reset options
    const letters = ['A', 'B', 'C'];
    this.optionButtons.forEach((btn, idx) => {
      btn.disabled = false;
      btn.className = 'quiz-option-btn';
      
      const textSpan = btn.querySelector('.option-text');
      if (textSpan) textSpan.textContent = currentQ.options[idx];

      const statusIcon = btn.querySelector('.option-status-icon');
      if (statusIcon) statusIcon.innerHTML = '';
    });

    // Hide feedback and next button
    this.feedbackBox.className = 'feedback-card hidden';
    this.nextBtn.classList.add('hidden');

    appState.announceSR(`Question ${this.currentIndex + 1}: ${currentQ.question}`);
  }

  handleAnswerSelection(selectedIndex) {
    if (this.hasAnswered) return; // Prevent multiple clicks on same question
    this.hasAnswered = true;

    const currentQ = this.questions[this.currentIndex];
    const isCorrect = (selectedIndex === currentQ.correctIndex);

    // Disable all options to prevent further clicks
    this.optionButtons.forEach(btn => btn.disabled = true);

    const chosenBtn = this.optionButtons[selectedIndex];
    const correctBtn = this.optionButtons[currentQ.correctIndex];

    if (isCorrect) {
      // Award 10 points
      this.score += 10;
      this.correctCount++;
      appState.addPoints(10);
      sounds.playSuccess();

      chosenBtn.classList.add('selected-correct');
      const icon = chosenBtn.querySelector('.option-status-icon');
      if (icon) icon.innerHTML = '✓';

      this.showFeedback(
        true,
        "Correct Answer! Great Job!",
        currentQ.explanation
      );
    } else {
      this.incorrectCount++;
      sounds.playError();

      chosenBtn.classList.add('selected-incorrect');
      const chosenIcon = chosenBtn.querySelector('.option-status-icon');
      if (chosenIcon) chosenIcon.innerHTML = '✗';

      // Highlight the correct answer for the user to learn
      correctBtn.classList.add('reveal-correct');
      const correctIcon = correctBtn.querySelector('.option-status-icon');
      if (correctIcon) correctIcon.innerHTML = '✓';

      this.showFeedback(
        false,
        "Keep Learning!",
        `The correct answer is ${['A', 'B', 'C'][currentQ.correctIndex]}. ${currentQ.options[currentQ.correctIndex]}. ${currentQ.explanation}`
      );
    }

    this.scoreDisplay.textContent = this.score;

    // Show Next button or Finish
    if (this.currentIndex < this.questions.length - 1) {
      this.nextBtn.querySelector('span').textContent = "Next Question";
    } else {
      this.nextBtn.querySelector('span').textContent = "See Results";
    }
    this.nextBtn.classList.remove('hidden');
    this.nextBtn.focus();
  }

  showFeedback(isSuccess, title, message) {
    this.feedbackBox.className = `feedback-card ${isSuccess ? 'correct' : 'incorrect'}`;
    this.feedbackIcon.textContent = isSuccess ? '🌟' : '💡';
    this.feedbackTitle.textContent = title;
    this.feedbackMsg.textContent = message;
    this.feedbackBox.classList.remove('hidden');

    appState.announceSR(`${title}. ${message}`);
  }

  nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex < this.questions.length) {
      this.renderQuestion();
    } else {
      this.showResults();
    }
  }

  showResults() {
    sounds.playCelebration();
    this.card.classList.add('hidden');
    this.resultsCard.classList.remove('hidden');

    const totalQuestions = this.questions.length;
    const maxScore = totalQuestions * 10;

    document.getElementById('quiz-final-score').textContent = this.score;
    document.getElementById('quiz-final-correct').textContent = this.correctCount;
    document.getElementById('quiz-final-incorrect').textContent = this.incorrectCount;

    const encouragement = appState.getFeedbackMessage(this.score, maxScore);
    document.getElementById('quiz-results-msg').textContent = encouragement;

    appState.announceSR(`Quiz complete! Final score: ${this.score} out of ${maxScore}. ${encouragement}`);
  }
}


/* ========================================================
   6. GAME 2: COMPLETE THE WORD CONTROLLER (MAIN STAR FEATURE)
   ======================================================== */
class CompleteWordGame {
  constructor() {
    this.challenges = [];
    this.currentIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.hasAnswered = false;

    // DOM Elements
    this.card = document.getElementById('complete-card');
    this.resultsCard = document.getElementById('complete-results-card');
    this.categoryEl = document.getElementById('complete-category');
    this.tilesContainer = document.getElementById('complete-tiles-container');
    this.clueText = document.getElementById('complete-clue-text');
    this.form = document.getElementById('complete-form');
    this.input = document.getElementById('complete-input');
    this.checkBtn = document.getElementById('complete-check-btn');
    this.progressText = document.getElementById('complete-progress-text');
    this.progressFill = document.getElementById('complete-progress-fill');
    this.progressBar = document.getElementById('complete-progress-bar');
    this.scoreDisplay = document.getElementById('complete-score-display');
    this.feedbackBox = document.getElementById('complete-feedback-box');
    this.feedbackTitle = document.getElementById('complete-feedback-title');
    this.feedbackMsg = document.getElementById('complete-feedback-msg');
    this.feedbackIcon = document.getElementById('complete-feedback-icon');
    this.nextBtn = document.getElementById('complete-next-btn');
    this.restartBtn = document.getElementById('complete-restart-btn');
    this.speakBtn = document.getElementById('complete-speak-btn');

    this.bindEvents();
  }

  bindEvents() {
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.checkAnswer();
    });

    this.nextBtn?.addEventListener('click', () => {
      sounds.playClick();
      this.nextChallenge();
    });

    this.restartBtn?.addEventListener('click', () => {
      sounds.playClick();
      this.start();
    });

    this.speakBtn?.addEventListener('click', () => {
      if (this.challenges.length > 0) {
        const item = this.challenges[this.currentIndex];
        sounds.speak(item.word);
      }
    });
  }

  start() {
    this.challenges = [...COMPLETE_DATA];
    this.currentIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.hasAnswered = false;

    this.card.classList.remove('hidden');
    this.resultsCard.classList.add('hidden');

    this.renderChallenge();
  }

  renderChallenge() {
    this.hasAnswered = false;
    const current = this.challenges[this.currentIndex];
    const total = this.challenges.length;

    // Header stats update
    this.progressText.textContent = `Challenge ${this.currentIndex + 1} of ${total}`;
    this.categoryEl.textContent = `Category: ${current.category}`;
    this.scoreDisplay.textContent = this.score;

    // Progress bar update
    const progressPct = ((this.currentIndex + 1) / total) * 100;
    this.progressFill.style.width = `${progressPct}%`;
    this.progressBar.setAttribute('aria-valuenow', Math.round(progressPct));

    // Render big tactile letter tiles
    this.renderTiles(current.display);

    // Clue text
    this.clueText.textContent = current.clue;

    // Reset input field & buttons
    this.input.value = '';
    this.input.disabled = false;
    this.checkBtn.disabled = false;
    this.feedbackBox.className = 'feedback-card hidden';
    this.nextBtn.classList.add('hidden');

    // Auto-focus input for quick typing
    setTimeout(() => {
      this.input.focus();
    }, 150);

    appState.announceSR(`Complete the Word challenge ${this.currentIndex + 1}: Clue: ${current.clue}. Word pattern: ${current.display}`);
  }

  renderTiles(displayPattern) {
    this.tilesContainer.innerHTML = '';
    // Characters are separated by spaces in display string: "B _ O K"
    const parts = displayPattern.split(' ');

    parts.forEach((char) => {
      const tile = document.createElement('div');
      tile.className = 'letter-tile';

      if (char === '_') {
        tile.classList.add('tile-blank');
        tile.textContent = '?';
        tile.setAttribute('aria-label', 'Missing letter slot');
      } else {
        tile.textContent = char;
        tile.setAttribute('aria-label', `Letter ${char}`);
      }

      this.tilesContainer.appendChild(tile);
    });
  }

  revealCompleteTiles(fullWord) {
    this.tilesContainer.innerHTML = '';
    for (const letter of fullWord) {
      const tile = document.createElement('div');
      tile.className = 'letter-tile tile-revealed';
      tile.textContent = letter;
      this.tilesContainer.appendChild(tile);
    }
  }

  checkAnswer() {
    if (this.hasAnswered) return;

    // Clean user input: trim accidental spaces, uppercase
    const rawVal = this.input.value;
    const cleanAnswer = rawVal.trim().toUpperCase();

    if (!cleanAnswer) {
      this.input.focus();
      return;
    }

    this.hasAnswered = true;
    this.input.disabled = true;
    this.checkBtn.disabled = true;

    const current = this.challenges[this.currentIndex];
    const isCorrect = (cleanAnswer === current.word.toUpperCase());

    if (isCorrect) {
      this.score += 10;
      this.correctCount++;
      appState.addPoints(10);
      sounds.playSuccess();
      sounds.speak(current.word);

      this.revealCompleteTiles(current.word);

      this.showFeedback(
        true,
        "Fantastic! Word Completed Correctly! (+10 pts)",
        `"${current.word}" - ${current.clue}`
      );
    } else {
      this.incorrectCount++;
      sounds.playError();

      // Reveal the correct word so learner immediately discovers the spelling
      this.revealCompleteTiles(current.word);

      this.showFeedback(
        false,
        "Not Quite Right, But Keep Going!",
        `The expected word was "${current.word}". Meaning: ${current.clue}`
      );
    }

    this.scoreDisplay.textContent = this.score;

    // Show Next button
    if (this.currentIndex < this.challenges.length - 1) {
      this.nextBtn.querySelector('span').textContent = "Next Word";
    } else {
      this.nextBtn.querySelector('span').textContent = "See Final Results";
    }
    this.nextBtn.classList.remove('hidden');
    this.nextBtn.focus();
  }

  showFeedback(isSuccess, title, message) {
    this.feedbackBox.className = `feedback-card ${isSuccess ? 'correct' : 'incorrect'}`;
    this.feedbackIcon.textContent = isSuccess ? '🎉' : '📖';
    this.feedbackTitle.textContent = title;
    this.feedbackMsg.textContent = message;
    this.feedbackBox.classList.remove('hidden');

    appState.announceSR(`${title}. ${message}`);
  }

  nextChallenge() {
    this.currentIndex++;
    if (this.currentIndex < this.challenges.length) {
      this.renderChallenge();
    } else {
      this.showResults();
    }
  }

  showResults() {
    sounds.playCelebration();
    this.card.classList.add('hidden');
    this.resultsCard.classList.remove('hidden');

    const totalChallenges = this.challenges.length;
    const maxScore = totalChallenges * 10;

    document.getElementById('complete-final-score').textContent = this.score;
    document.getElementById('complete-final-correct').textContent = this.correctCount;
    document.getElementById('complete-final-incorrect').textContent = this.incorrectCount;

    const encouragement = appState.getFeedbackMessage(this.score, maxScore);
    document.getElementById('complete-results-msg').textContent = encouragement;

    appState.announceSR(`Complete the Word challenge finished! Total score: ${this.score} out of ${maxScore}. ${encouragement}`);
  }
}


/* ========================================================
   7. GAME 3: GUESS THE WORD CONTROLLER
   ======================================================== */
class GuessWordGame {
  constructor() {
    this.challenges = [];
    this.currentIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.hasAnswered = false;
    this.attemptsLeft = 3;
    this.maxAttempts = 3;

    // DOM Elements
    this.card = document.getElementById('guess-card');
    this.resultsCard = document.getElementById('guess-results-card');
    this.clueText = document.getElementById('guess-clue-text');
    this.hintBox = document.getElementById('guess-hint-box');
    this.hintText = document.getElementById('guess-hint-text');
    this.hintBtn = document.getElementById('guess-hint-btn');
    this.attemptsPips = document.getElementById('guess-attempts-pips');
    this.form = document.getElementById('guess-form');
    this.input = document.getElementById('guess-input');
    this.submitBtn = document.getElementById('guess-submit-btn');
    this.progressText = document.getElementById('guess-progress-text');
    this.progressFill = document.getElementById('guess-progress-fill');
    this.progressBar = document.getElementById('guess-progress-bar');
    this.scoreDisplay = document.getElementById('guess-score-display');
    this.feedbackBox = document.getElementById('guess-feedback-box');
    this.feedbackTitle = document.getElementById('guess-feedback-title');
    this.feedbackMsg = document.getElementById('guess-feedback-msg');
    this.feedbackIcon = document.getElementById('guess-feedback-icon');
    this.nextBtn = document.getElementById('guess-next-btn');
    this.restartBtn = document.getElementById('guess-restart-btn');

    this.bindEvents();
  }

  bindEvents() {
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitGuess();
    });

    this.hintBtn?.addEventListener('click', () => {
      sounds.playClick();
      this.revealHint();
    });

    this.nextBtn?.addEventListener('click', () => {
      sounds.playClick();
      this.nextChallenge();
    });

    this.restartBtn?.addEventListener('click', () => {
      sounds.playClick();
      this.start();
    });
  }

  start() {
    this.challenges = [...GUESS_DATA];
    this.currentIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.hasAnswered = false;

    this.card.classList.remove('hidden');
    this.resultsCard.classList.add('hidden');

    this.renderChallenge();
  }

  renderChallenge() {
    this.hasAnswered = false;
    this.attemptsLeft = this.maxAttempts;
    const current = this.challenges[this.currentIndex];
    const total = this.challenges.length;

    // Header stats update
    this.progressText.textContent = `Challenge ${this.currentIndex + 1} of ${total}`;
    this.scoreDisplay.textContent = this.score;

    // Progress bar
    const progressPct = ((this.currentIndex + 1) / total) * 100;
    this.progressFill.style.width = `${progressPct}%`;
    this.progressBar.setAttribute('aria-valuenow', Math.round(progressPct));

    // Clue text & hint
    this.clueText.textContent = `"${current.clue}"`;
    this.hintText.textContent = current.hint;
    this.hintBox.classList.add('hidden');
    this.hintBtn.classList.remove('hidden');

    // Update attempts visual pips
    this.updateAttemptsPips();

    // Reset input & buttons
    this.input.value = '';
    this.input.disabled = false;
    this.submitBtn.disabled = false;
    this.feedbackBox.className = 'feedback-card hidden';
    this.nextBtn.classList.add('hidden');

    setTimeout(() => {
      this.input.focus();
    }, 150);

    appState.announceSR(`Guess the Word Riddle ${this.currentIndex + 1}: ${current.clue}. You have 3 attempts.`);
  }

  updateAttemptsPips() {
    if (!this.attemptsPips) return;
    this.attemptsPips.innerHTML = '';
    for (let i = 0; i < this.maxAttempts; i++) {
      const pip = document.createElement('span');
      pip.className = `attempt-pip ${i < this.attemptsLeft ? 'active' : ''}`;
      pip.setAttribute('title', `Attempt ${i + 1}`);
      this.attemptsPips.appendChild(pip);
    }
  }

  revealHint() {
    this.hintBox.classList.remove('hidden');
    this.hintBtn.classList.add('hidden');
    appState.announceSR(`Hint: ${this.challenges[this.currentIndex].hint}`);
  }

  submitGuess() {
    if (this.hasAnswered) return;

    const rawVal = this.input.value;
    const cleanGuess = rawVal.trim().toUpperCase();

    if (!cleanGuess) {
      this.input.focus();
      return;
    }

    const current = this.challenges[this.currentIndex];
    // Check against primary answer and acceptable alternative synonyms
    const isMatch = current.acceptable.some(ans => ans.toUpperCase() === cleanGuess);

    if (isMatch) {
      // Correct!
      this.hasAnswered = true;
      this.score += 10;
      this.correctCount++;
      appState.addPoints(10);
      sounds.playSuccess();
      sounds.speak(current.answer);

      this.input.disabled = true;
      this.submitBtn.disabled = true;

      this.showFeedback(
        true,
        "You Guessed It Right! (+10 pts)",
        `The word is "${current.answer}". Excellent reading skills!`
      );
      this.enableNextAction();
    } else {
      // Incorrect attempt
      this.attemptsLeft--;
      this.updateAttemptsPips();
      sounds.playError();

      if (this.attemptsLeft > 0) {
        // Still has attempts left
        this.revealHint(); // Automatically show hint to help learner
        this.showFeedback(
          false,
          "Not quite! Try again.",
          `You have ${this.attemptsLeft} attempt${this.attemptsLeft === 1 ? '' : 's'} remaining. We revealed a hint for you above!`
        );
        this.input.select();
      } else {
        // Out of attempts for this riddle
        this.hasAnswered = true;
        this.incorrectCount++;
        this.input.disabled = true;
        this.submitBtn.disabled = true;

        this.showFeedback(
          false,
          "Out of attempts!",
          `The hidden word was "${current.answer}". Great try! Learn it for next time.`
        );
        this.enableNextAction();
      }
    }

    this.scoreDisplay.textContent = this.score;
  }

  enableNextAction() {
    if (this.currentIndex < this.challenges.length - 1) {
      this.nextBtn.querySelector('span').textContent = "Next Challenge";
    } else {
      this.nextBtn.querySelector('span').textContent = "See Final Results";
    }
    this.nextBtn.classList.remove('hidden');
    this.nextBtn.focus();
  }

  showFeedback(isSuccess, title, message) {
    this.feedbackBox.className = `feedback-card ${isSuccess ? 'correct' : 'incorrect'}`;
    this.feedbackIcon.textContent = isSuccess ? '🏆' : '🔍';
    this.feedbackTitle.textContent = title;
    this.feedbackMsg.textContent = message;
    this.feedbackBox.classList.remove('hidden');

    appState.announceSR(`${title}. ${message}`);
  }

  nextChallenge() {
    this.currentIndex++;
    if (this.currentIndex < this.challenges.length) {
      this.renderChallenge();
    } else {
      this.showResults();
    }
  }

  showResults() {
    sounds.playCelebration();
    this.card.classList.add('hidden');
    this.resultsCard.classList.remove('hidden');

    const totalChallenges = this.challenges.length;
    const maxScore = totalChallenges * 10;

    document.getElementById('guess-final-score').textContent = this.score;
    document.getElementById('guess-final-correct').textContent = this.correctCount;
    document.getElementById('guess-final-incorrect').textContent = this.incorrectCount;

    const encouragement = appState.getFeedbackMessage(this.score, maxScore);
    document.getElementById('guess-results-msg').textContent = encouragement;

    appState.announceSR(`Guess the Word completed! Total score: ${this.score} out of ${maxScore}. ${encouragement}`);
  }
}


/* ========================================================
   8. APPLICATION INITIALIZATION
   ======================================================== */
let navigationController, quizGame, completeGame, guessGame;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Controllers
  navigationController = new NavigationController();
  quizGame = new QuizGame();
  completeGame = new CompleteWordGame();
  guessGame = new GuessWordGame();

  // Keyboard accessibility helper: allow ESC to quickly return home
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appState.activeView !== 'home') {
      navigationController.showView('home');
    }
  });
});

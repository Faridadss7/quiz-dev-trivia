// quiz.js — Dev Trivia | Level Up Africa
// Features : splash, nom joueur, timer, streak, sons, animations,
//            récap + temps/réponse, localStorage (score, historique, thème),
//            partage de score, prefers-color-scheme

// ─── État ─────────────────────────────────────────────────────────────────────
let questions      = [];
let currentIndex   = 0;
let score          = 0;
let streak         = 0;
let timerInterval  = null;
let timeLeft       = 20;
let answered       = false;
let userAnswers    = [];      // { question, selected, correct, ok, elapsed }
let questionStart  = 0;       // timestamp début de question (performance.now)
let quizStart      = 0;       // timestamp début du quiz entier
let playerName     = '';      // prénom saisi

const TIMER_MAX     = 20;
const CIRCUMFERENCE = 2 * Math.PI * 18;
const MAX_HISTORY   = 5;

// ─── DOM ──────────────────────────────────────────────────────────────────────
const splash       = document.getElementById('splash');
const splashBar    = document.getElementById('splash-bar');
const topBar       = document.getElementById('top-bar');
const mainWrapper  = document.querySelector('.main-wrapper');

const screenStart  = document.getElementById('screen-start');
const screenQuiz   = document.getElementById('screen-quiz');
const screenResult = document.getElementById('screen-result');

const playerNameInput  = document.getElementById('player-name');
const historySection   = document.getElementById('history-section');
const historyList      = document.getElementById('history-list');
const bestScoreBanner  = document.getElementById('best-score-banner');
const bestScoreValue   = document.getElementById('best-score-value');

const questionCounter  = document.getElementById('question-counter');
const qNumSpan         = document.getElementById('q-num');
const questionText     = document.getElementById('question-text');
const optionsGrid      = document.getElementById('options-grid');
const feedbackBox      = document.getElementById('feedback-box');
const btnNext          = document.getElementById('btn-next');
const progressBar      = document.getElementById('progress-bar');
const timerText        = document.getElementById('timer-text');
const ringProgress     = document.getElementById('ring-progress');
const quizCard         = document.getElementById('quiz-card');
const streakDisplay    = document.getElementById('streak-display');
const streakCount      = document.getElementById('streak-count');
const playerGreeting   = document.getElementById('player-greeting');

const resultPlayerName = document.getElementById('result-player-name');
const resultTitle      = document.getElementById('result-title');
const resultMessage    = document.getElementById('result-message');
const scoreNum         = document.getElementById('score-num');
const scoreBarFill     = document.getElementById('score-bar-fill');
const newRecordBadge   = document.getElementById('new-record-badge');
const quizDurationEl   = document.getElementById('quiz-duration');
const quizDurationVal  = document.getElementById('quiz-duration-value');
const recapTbody       = document.getElementById('recap-tbody');
const btnShare         = document.getElementById('btn-share');
const shareToast       = document.getElementById('share-toast');

const btnStart         = document.getElementById('btn-start');
const btnRestart       = document.getElementById('btn-restart');

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function runSplash() {
  // Masquer header + main pendant le splash
  topBar.classList.add('app-hidden');
  mainWrapper.classList.add('app-hidden');

  // Déclencher la barre de chargement après un frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { splashBar.style.width = '100%'; });
  });

  // Après 1.8s : cacher le splash, afficher l'app
  setTimeout(() => {
    splash.classList.add('hidden');
    topBar.classList.remove('app-hidden');
    mainWrapper.classList.remove('app-hidden');

    // Animer l'écran d'accueil
    screenStart.classList.add('active', 'enter');
    const cleanup = () => screenStart.classList.remove('enter');
    screenStart.addEventListener('animationend', cleanup, { once: true });
    setTimeout(cleanup, 600);
  }, 1800);
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSITIONS D'ÉCRANS
// ─────────────────────────────────────────────────────────────────────────────

function showScreen(nextScreen) {
  const current = document.querySelector('.screen.active');

  if (!current || current === nextScreen) {
    nextScreen.classList.add('active', 'enter');
    const cleanup = () => nextScreen.classList.remove('enter');
    nextScreen.addEventListener('animationend', cleanup, { once: true });
    setTimeout(cleanup, 600);
    return;
  }

  const EXIT_MS = 300;
  current.classList.add('exit');

  const enterNext = () => {
    current.classList.remove('active', 'exit');
    nextScreen.classList.add('active', 'enter');
    const cleanEnter = () => nextScreen.classList.remove('enter');
    nextScreen.addEventListener('animationend', cleanEnter, { once: true });
    setTimeout(cleanEnter, 600);
  };

  current.addEventListener('animationend', enterNext, { once: true });
  setTimeout(enterNext, EXIT_MS);
}

// ─────────────────────────────────────────────────────────────────────────────
// SONS — Web Audio API synthétique
// ─────────────────────────────────────────────────────────────────────────────
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playSound(type) {
  try {
    const ctx = getAudioCtx();
    if (type === 'correct') {
      tone(ctx, 'sine',     520,  0,    0.08, 0.12);
      tone(ctx, 'sine',     780,  0.12, 0.08, 0.15);
    } else if (type === 'wrong') {
      tone(ctx, 'sawtooth', 200,  0,    0.15, 0.25);
      tone(ctx, 'sawtooth', 140,  0.18, 0.12, 0.22);
    } else if (type === 'timeout') {
      [0, 0.15, 0.3].forEach(d => tone(ctx, 'square', 330, d, 0.07, 0.1));
    } else if (type === 'victory') {
      [330, 392, 494, 660].forEach((f, i) => tone(ctx, 'sine', f, i * 0.18, 0.1, 0.22));
    }
  } catch (_) { /* silent fail */ }
}

function tone(ctx, type, freq, delay, vol, dur) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = vol;
  const t = ctx.currentTime + delay;
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCALSTORAGE
// ─────────────────────────────────────────────────────────────────────────────
const LS_SCORE   = 'devTrivia_bestScore';
const LS_THEME   = 'devTrivia_theme';
const LS_NAME    = 'devTrivia_playerName';
const LS_HISTORY = 'devTrivia_history';

// Score
function loadBestScore() {
  const v = localStorage.getItem(LS_SCORE);
  return v !== null ? parseInt(v, 10) : null;
}
function saveBestScore(s) {
  const cur = loadBestScore();
  if (cur === null || s > cur) { localStorage.setItem(LS_SCORE, s); return true; }
  return false;
}
function displayBestScore() {
  const best = loadBestScore();
  if (best !== null) {
    bestScoreValue.textContent = best;
    bestScoreBanner.classList.remove('hidden');
  }
}

// Historique
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY)) || []; }
  catch (_) { return []; }
}
function saveHistory(entry) {
  const history = loadHistory();
  history.unshift(entry);             // plus récent en premier
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  localStorage.setItem(LS_HISTORY, JSON.stringify(history));
}
function displayHistory() {
  const history = loadHistory();
  if (history.length === 0) { historySection.classList.add('hidden'); return; }

  historySection.classList.remove('hidden');
  historyList.innerHTML = '';

  history.forEach((entry, i) => {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.style.animationDelay = `${i * 60}ms`;

    const scoreColor = entry.score >= 14 ? 'var(--success)' : entry.score >= 10 ? 'var(--warn)' : 'var(--danger)';
    li.innerHTML = `
      <span class="history-item__name">${escapeHtml(entry.name || 'Anonyme')}</span>
      <span class="history-item__score" style="color:${scoreColor}">${entry.score} / 20</span>
      <span class="history-item__date">${entry.date}</span>
    `;
    historyList.appendChild(li);
  });
}

// Nom du joueur
function loadSavedName() {
  return localStorage.getItem(LS_NAME) || '';
}
function saveName(name) {
  localStorage.setItem(LS_NAME, name);
}

// ─────────────────────────────────────────────────────────────────────────────
// THÈME — avec détection prefers-color-scheme au 1er lancement
// ─────────────────────────────────────────────────────────────────────────────
function initTheme() {
  let saved = localStorage.getItem(LS_THEME);

  // 1er lancement : respecter la préférence système
  if (!saved) {
    saved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(LS_THEME, theme);
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === theme);
  });
}

document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
});

// ─────────────────────────────────────────────────────────────────────────────
// UTILITAIRES
// ─────────────────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatDate(d) {
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

// ─────────────────────────────────────────────────────────────────────────────
// TIMER
// ─────────────────────────────────────────────────────────────────────────────
function startTimer() {
  timeLeft = TIMER_MAX;
  updateTimerUI();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI();
    if (timeLeft <= 0) { clearInterval(timerInterval); if (!answered) handleTimeout(); }
  }, 1000);
}

function stopTimer() { clearInterval(timerInterval); }

function updateTimerUI() {
  timerText.textContent = timeLeft;
  const color = timeLeft <= 5 ? 'var(--danger)' : timeLeft <= 10 ? 'var(--warn)' : 'var(--accent)';
  ringProgress.style.stroke = color;
  timerText.style.color     = timeLeft <= 10 ? color : '';
  const offset = CIRCUMFERENCE * (1 - timeLeft / TIMER_MAX);
  ringProgress.style.strokeDashoffset = CIRCUMFERENCE - offset;
}

// ─────────────────────────────────────────────────────────────────────────────
// STREAK
// ─────────────────────────────────────────────────────────────────────────────
function updateStreak(ok) {
  streak = ok ? streak + 1 : 0;
  if (streak >= 2) {
    streakCount.textContent = streak;
    streakDisplay.classList.remove('hidden');
    streakDisplay.style.animation = 'none';
    void streakDisplay.offsetHeight;
    streakDisplay.style.animation = '';
  } else {
    streakDisplay.classList.add('hidden');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHARGEMENT QUESTION
// ─────────────────────────────────────────────────────────────────────────────
function loadQuestion() {
  answered      = false;
  questionStart = performance.now();

  const q     = questions[currentIndex];
  const total = questions.length;

  questionCounter.textContent = `${currentIndex + 1} / ${total}`;
  if (qNumSpan) qNumSpan.textContent = currentIndex + 1;

  progressBar.style.width = `${(currentIndex / total) * 100}%`;

  questionText.textContent = q.question;
  optionsGrid.innerHTML    = '';

  shuffle(q.options).forEach(opt => {
    const btn       = document.createElement('button');
    btn.className   = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(opt, q.answer));
    optionsGrid.appendChild(btn);
  });

  feedbackBox.className   = 'feedback-box hidden';
  feedbackBox.textContent = '';
  btnNext.classList.add('hidden');

  quizCard.classList.remove('slide-out', 'slide-in');
  quizCard.classList.add('slide-in');
  quizCard.addEventListener('animationend', () => quizCard.classList.remove('slide-in'), { once: true });

  startTimer();
}

// ─────────────────────────────────────────────────────────────────────────────
// RÉPONSES
// ─────────────────────────────────────────────────────────────────────────────
function handleAnswer(selected, correct) {
  if (answered) return;
  answered = true;
  stopTimer();

  const elapsed = Math.round((performance.now() - questionStart) / 1000);
  const ok      = selected === correct;
  if (ok) score++;

  updateStreak(ok);
  playSound(ok ? 'correct' : 'wrong');

  userAnswers.push({
    question: questions[currentIndex].question,
    selected,
    correct,
    ok,
    elapsed
  });

  Array.from(optionsGrid.children).forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct)           btn.classList.add('correct');
    else if (btn.textContent === selected && !ok) btn.classList.add('wrong');
  });

  showFeedback(ok, correct);
  showNextOrEnd();
}

function handleTimeout() {
  answered = true;
  const correct = questions[currentIndex].answer;
  playSound('timeout');
  updateStreak(false);
  userAnswers.push({
    question: questions[currentIndex].question,
    selected: 'Temps écoulé',
    correct,
    ok: false,
    elapsed: TIMER_MAX
  });

  Array.from(optionsGrid.children).forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add('correct');
  });

  feedbackBox.className   = 'feedback-box wrong-fb';
  feedbackBox.textContent = `Temps écoulé. La réponse était : ${correct}`;
  showNextOrEnd();
}

function showFeedback(ok, correct) {
  if (ok) {
    feedbackBox.className   = 'feedback-box correct-fb';
    feedbackBox.textContent = streak >= 3
      ? `Bonne réponse — ${streak} consécutives`
      : 'Bonne réponse';
  } else {
    feedbackBox.className   = 'feedback-box wrong-fb';
    feedbackBox.textContent = `Réponse incorrecte. La bonne réponse était : ${correct}`;
  }
}

function showNextOrEnd() {
  btnNext.classList.remove('hidden');
  btnNext.textContent = currentIndex >= questions.length - 1 ? 'Voir les résultats' : 'Suivant';
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────
btnNext.addEventListener('click', () => {
  quizCard.classList.add('slide-out');
  quizCard.addEventListener('animationend', () => {
    quizCard.classList.remove('slide-out');
    currentIndex++;
    if (currentIndex < questions.length) loadQuestion();
    else showResults();
  }, { once: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// RÉSULTATS
// ─────────────────────────────────────────────────────────────────────────────
const PROFILES = [
  { min: 18, title: 'Future Dev africain',   message: 'Maîtrise totale des fondamentaux. Tu es prêt pour le prochain niveau — frameworks, projets réels, open source.' },
  { min: 14, title: 'Dev en orbite',          message: 'Très solide. Quelques zones d\'incertitude subsistent, mais les bases sont là. Continue à coder chaque jour.' },
  { min: 10, title: 'Apprenti développeur',   message: 'Bonne progression. Relis les réponses manquées, pratique sur de petits projets, et reviens challenger ce score.' },
  { min:  6, title: 'Junior en construction', message: 'Les fondamentaux demandent encore de la pratique. HTML, CSS, JS — reprends depuis la base, progressivement.' },
  { min:  0, title: 'Point de départ',        message: 'Tout le monde commence ici. L\'important, c\'est de commencer à coder, chaque jour un peu plus.' },
];

function animateScore(target, duration = 900) {
  const start = performance.now();
  const ease  = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  function step(now) {
    const elapsed  = Math.min(now - start, duration);
    scoreNum.textContent = Math.round(ease(elapsed / duration) * target);
    if (elapsed < duration) requestAnimationFrame(step);
    else scoreNum.textContent = target;
  }
  requestAnimationFrame(step);
}

function buildRecap() {
  recapTbody.innerHTML = '';
  userAnswers.forEach((e, i) => {
    const tr     = document.createElement('tr');
    tr.className = e.ok ? 'row-correct' : 'row-wrong';
    const shortQ = e.question.length > 48 ? e.question.slice(0, 45) + '…' : e.question;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td title="${escapeHtml(e.question)}">${escapeHtml(shortQ)}</td>
      <td>${escapeHtml(e.selected)}</td>
      <td>${escapeHtml(e.correct)}</td>
      <td>${e.elapsed}s</td>
      <td class="recap-status">${e.ok ? '✓' : '✗'}</td>
    `;
    recapTbody.appendChild(tr);
  });
}

function formatDuration(ms) {
  const totalSec = Math.round(ms / 1000);
  const min      = Math.floor(totalSec / 60);
  const sec      = totalSec % 60;
  return min > 0
    ? `${min} min ${sec.toString().padStart(2, '0')} s`
    : `${sec} s`;
}

function showResults() {
  showScreen(screenResult);

  const quizDuration = performance.now() - quizStart;
  const profile      = PROFILES.find(p => score >= p.min);
  const isRecord     = saveBestScore(score);

  // Nom du joueur dans les résultats
  if (playerName) {
    resultPlayerName.textContent = playerName;
    resultPlayerName.classList.remove('hidden');
  } else {
    resultPlayerName.classList.add('hidden');
  }

  resultTitle.textContent   = profile.title;
  resultMessage.textContent = profile.message;
  newRecordBadge.classList.toggle('hidden', !isRecord);

  // Temps total
  quizDurationVal.textContent = formatDuration(quizDuration);
  quizDurationEl.classList.remove('hidden');

  scoreNum.textContent = '0';
  setTimeout(() => animateScore(score), 350);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    scoreBarFill.style.width = `${(score / questions.length) * 100}%`;
  }));

  if (score >= 14) playSound('victory');

  // Sauvegarder dans l'historique
  saveHistory({
    name:  playerName || 'Anonyme',
    score: score,
    date:  formatDate(new Date())
  });

  buildRecap();
  displayBestScore();
  displayHistory();
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTAGE DE SCORE
// ─────────────────────────────────────────────────────────────────────────────
btnShare.addEventListener('click', () => {
  const name  = playerName ? `${playerName} ` : '';
  const profile = PROFILES.find(p => score >= p.min);
  const text  = `${name}a fait ${score}/20 au Dev Trivia — Level Up Africa !\n"${profile.title}" — #LevelUpAfrica #DevTrivia`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showShareToast).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
});

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showShareToast(); } catch (_) {}
  document.body.removeChild(ta);
}

function showShareToast() {
  shareToast.classList.remove('hidden');
  setTimeout(() => shareToast.classList.add('hidden'), 3000);
}

// ─────────────────────────────────────────────────────────────────────────────
// INIT / RESTART
// ─────────────────────────────────────────────────────────────────────────────
function startQuiz() {
  // Récupérer et sauvegarder le nom
  playerName = playerNameInput.value.trim();
  if (!playerName) playerName = loadSavedName() || 'Anonyme';
  if (playerNameInput.value.trim()) saveName(playerNameInput.value.trim());

  // Afficher le prénom pendant le quiz
  if (playerName && playerName !== 'Anonyme') {
    playerGreeting.textContent = `Bonne chance, ${playerName}`;
    playerGreeting.classList.remove('hidden');
  } else {
    playerGreeting.classList.add('hidden');
  }

  questions    = shuffle(QUESTIONS);
  currentIndex = 0;
  score        = 0;
  streak       = 0;
  answered     = false;
  userAnswers  = [];
  quizStart    = performance.now();

  streakDisplay.classList.add('hidden');
  scoreBarFill.style.width = '0%';
  shareToast.classList.add('hidden');

  showScreen(screenQuiz);
  loadQuestion();
}

btnStart.addEventListener('click', startQuiz);

btnRestart.addEventListener('click', () => {
  // Retourner à l'accueil pour permettre de changer de nom
  scoreBarFill.style.width = '0%';
  shareToast.classList.add('hidden');
  showScreen(screenStart);
  displayHistory();
});

// ─────────────────────────────────────────────────────────────────────────────
// DÉMARRAGE
// ─────────────────────────────────────────────────────────────────────────────
initTheme();

// Pré-remplir le nom si déjà joué
const savedName = loadSavedName();
if (savedName) playerNameInput.value = savedName;

// Permettre de lancer avec Entrée
playerNameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') btnStart.click();
});

displayBestScore();
displayHistory();

// Lancer le splash
runSplash();

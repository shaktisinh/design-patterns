// ============================================
// PARTICLES
// ============================================
function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (-Math.random() * 20) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
    const colors = ['#00d4ff', '#7c3aed', '#10b981'];
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(p);
  }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { 
    if (e.isIntersecting) e.target.classList.add('visible'); 
  });
}, { threshold: 0.1 });

function initScrollAnimations() {
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ============================================
// NAVIGATION
// ============================================
function setActive(el) {
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

function scrollTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// CODE EXPAND/COLLAPSE
// ============================================
function toggleCode(btn) {
  const panel = btn.nextElementSibling;
  panel.classList.toggle('open');
  btn.classList.toggle('open');
  btn.innerHTML = panel.classList.contains('open') 
    ? 'Hide Code <span class="arrow">▼</span>' 
    : 'View Code <span class="arrow">▼</span>';
}

function switchTab(tab, contentId) {
  const card = tab.closest('.code-panel');
  card.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
  card.querySelectorAll('.code-content').forEach(c => c.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(contentId).classList.add('active');
}

// ============================================
// FILTER & SEARCH
// ============================================
function filterByCategory(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.pattern-card').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function filterPatterns(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.pattern-card').forEach(card => {
    const name = card.dataset.name || '';
    card.classList.toggle('hidden', q.length > 0 && !name.includes(q));
  });
}

// ============================================
// QUIZ DATA & LOGIC
// ============================================
const quizData = [
  {
    q: "In Android, LiveData and ChangeNotifier in Flutter are implementations of which pattern?",
    opts: ["Singleton", "Observer", "Decorator", "Strategy"],
    correct: 1,
    explanation: "✅ LiveData and ChangeNotifier implement the Observer pattern — multiple UI components subscribe and get notified when state changes."
  },
  {
    q: "RecyclerView.Adapter in Android bridges your List<Data> to what the RecyclerView expects. This is the...",
    opts: ["Builder Pattern", "Factory Method", "Adapter Pattern", "Command Pattern"],
    correct: 2,
    explanation: "✅ Adapter Pattern! It converts the interface your data has (List<User>) into the interface RecyclerView needs (ViewHolder + getItemCount)."
  },
  {
    q: "Which SOLID principle says 'A class should have only one reason to change'?",
    opts: ["Open/Closed", "Liskov Substitution", "Interface Segregation", "Single Responsibility"],
    correct: 3,
    explanation: "✅ Single Responsibility Principle (SRP)! Your Activity handles UI, ViewModel handles logic, Repository handles data — each has ONE reason to change."
  },
  {
    q: "Flutter's widget nesting (Padding → Opacity → Card → Text) is an example of which pattern?",
    opts: ["Composite", "Decorator", "Builder", "Proxy"],
    correct: 1,
    explanation: "✅ Decorator Pattern! Each widget wraps another, adding behavior (padding, opacity, elevation) dynamically without changing the inner widget."
  },
  {
    q: "In MVVM, which layer should contain your API call logic and database queries?",
    opts: ["View (Activity/Fragment)", "ViewModel", "Repository (Model)", "XML layout"],
    correct: 2,
    explanation: "✅ Repository/Model layer! The ViewModel should only orchestrate data flow. The Repository decides whether to fetch from API or return cached DB data."
  }
];

let currentQ = 0, score = 0, answered = false;

function renderQuestion() {
  const qData = quizData[currentQ];
  const container = document.getElementById('quizContainer');
  container.innerHTML = `
    <div class="quiz-q">Q${currentQ + 1}: ${qData.q}</div>
    <div class="quiz-opts">
      ${qData.opts.map((opt, i) => `<div class="quiz-opt" onclick="selectAnswer(${i})">${String.fromCharCode(65+i)}) ${opt}</div>`).join('')}
    </div>
    <div class="quiz-feedback" id="feedback"></div>
  `;
  document.getElementById('quizProgress').textContent = `Question ${currentQ + 1} / ${quizData.length}`;
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'none';
  answered = false;
}

function selectAnswer(idx) {
  if (answered) return;
  answered = true;
  const qData = quizData[currentQ];
  const opts = document.querySelectorAll('.quiz-opt');
  opts[idx].classList.add(idx === qData.correct ? 'correct' : 'wrong');
  opts[qData.correct].classList.add('correct');
  if (idx === qData.correct) score++;
  const fb = document.getElementById('feedback');
  fb.textContent = qData.explanation;
  fb.className = 'quiz-feedback show ' + (idx === qData.correct ? 'correct' : 'wrong');
  if (currentQ < quizData.length - 1) {
    document.getElementById('nextBtn').style.display = 'block';
  } else {
    const pct = Math.round((score / quizData.length) * 100);
    document.getElementById('scoreDisplay').textContent = `Score: ${score}/${quizData.length} (${pct}%) ${pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}`;
    document.getElementById('restartBtn').style.display = 'block';
  }
}

function nextQuestion() {
  currentQ++;
  renderQuestion();
}

function restartQuiz() {
  currentQ = 0; score = 0;
  document.getElementById('scoreDisplay').textContent = '';
  renderQuestion();
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  createParticles();
  initScrollAnimations();
  renderQuestion();
});

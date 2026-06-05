// ─────────────────────────────────────────────────
//  1. STATE — ஆப்-ஓட தரவுகள் (Data State)
// ─────────────────────────────────────────────────

const KEY_TODOS = 'my_todos_v3'; // schema upgrade v3
const KEY_USER  = 'my_todo_username';
const KEY_THEME = 'my_todo_theme';
const KEY_POMO  = 'my_pomo_sessions';
const KEY_HUE   = 'my_custom_hue';

// Load stored data or set defaults
let todos        = JSON.parse(localStorage.getItem(KEY_TODOS) || '[]');
let username     = localStorage.getItem(KEY_USER) || 'Productive User';
let theme        = localStorage.getItem(KEY_THEME) || 'lime';
let pomoSessions = JSON.parse(localStorage.getItem(KEY_POMO) || '[]');
let customHue    = localStorage.getItem(KEY_HUE) || null;

let currentView  = 'dashboard'; // active tab view
let filter       = 'all';       // current active tab filter
let editingId    = null;        // editing text todo id
let expandedIds  = [];          // expanded details todo ids
let searchQuery  = '';          // search text input
let sortBy       = 'date-desc'; // task sort option

// ─────────────────────────────────────────────────
//  1b. SCHEMA MIGRATION — பழைய தரவுகளை புதிய அமைப்புக்கு மாற்றுவது
// ─────────────────────────────────────────────────
todos = todos.map(function(todo) {
  return {
    id: todo.id || Date.now().toString(36),
    text: todo.text || '',
    completed: typeof todo.completed === 'boolean' ? todo.completed : false,
    priority: todo.priority || 'medium',
    category: todo.category || 'personal',
    dueDate: todo.dueDate || null,
    notes: todo.notes || '',
    subtasks: Array.isArray(todo.subtasks) ? todo.subtasks : [],
    createdAt: todo.createdAt || Date.now(),
    completedAt: todo.completedAt || (todo.completed ? todo.createdAt || Date.now() : null)
  };
});
localStorage.setItem(KEY_TODOS, JSON.stringify(todos));

// ─────────────────────────────────────────────────
//  2. POMODORO TIMER STATE
// ─────────────────────────────────────────────────
let pomoTimer      = null;
let pomoWorkMins   = 25;
let pomoBreakMins  = 5;
let pomoTimeLeft   = 25 * 60; // 25 mins work by default
let pomoIsRunning  = false;
let pomoMode       = 'work';  // 'work' or 'break'
let pomoSound      = true;    // play sound alert

// ─────────────────────────────────────────────────
//  2b. MOTIVATIONAL QUOTES DATABASE
// ─────────────────────────────────────────────────
const MOTIVATIONAL_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Your limit is only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Dream bigger. Do bigger.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Do something today that your future self will thank you for.", author: "Unknown" },
  { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" }
];

// ─────────────────────────────────────────────────
//  3. DOM REFERENCES — HTML கூறுகளைக் குறிவைப்பது
// ─────────────────────────────────────────────────

// Navigation
const navbar       = document.getElementById('navbar');
const navBtns      = document.querySelectorAll('.nav-btn');
const pageViews    = document.querySelectorAll('.page-view');

// Dashboard View
const usernameDisp = document.getElementById('username-display');
const currentDate  = document.getElementById('current-date');
const dashTotal    = document.getElementById('dash-stat-total');
const dashActive   = document.getElementById('dash-stat-active');
const dashDone     = document.getElementById('dash-stat-done');
const dashUrgent   = document.getElementById('dash-stat-urgent');
const dashPomoCount = document.getElementById('dash-stat-pomo');
const catProgress  = document.getElementById('category-progress-list');
const quoteText    = document.getElementById('quote-text');
const quoteAuthor  = document.getElementById('quote-author');
const chartContainer = document.getElementById('chart-container');

// Pomodoro Timer
const pomoTime     = document.getElementById('pomo-time');
const pomoStatus   = document.getElementById('pomo-status');
const pomoPlayBtn  = document.getElementById('pomo-play-btn');
const pomoResetBtn = document.getElementById('pomo-reset-btn');
const pomoSoundBtn = document.getElementById('pomo-sound-btn');
const pomoCircle   = document.getElementById('pomo-circle');
const pomoWorkInput = document.getElementById('pomo-work-input');
const pomoBreakInput = document.getElementById('pomo-break-input');
const pomoSettings   = document.getElementById('pomo-settings');

// Tasks View
const newTaskInput = document.getElementById('new-task');
const addBtn       = document.getElementById('add-btn');
const toggleAdvBtn = document.getElementById('toggle-adv-btn');
const advOptions   = document.getElementById('adv-options');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');
const taskDueDate  = document.getElementById('task-due-date');

const searchInput  = document.getElementById('search-input');
const sortSelect   = document.getElementById('sort-select');
const filterBtns   = document.querySelectorAll('.filter-btn');
const todoList     = document.getElementById('todo-list');
const statsBar     = document.getElementById('stats-bar');
const statTotal    = document.getElementById('stat-total');
const statActive   = document.getElementById('stat-active');
const statDone      = document.getElementById('stat-done');
const bottomBar    = document.getElementById('bottom-bar');
const countLabel   = document.getElementById('count-label');
const clearBtn     = document.getElementById('clear-btn');

// Settings View
const usernameInput = document.getElementById('username-input');
const saveUserBtn   = document.getElementById('save-username-btn');
const themeBtns     = document.querySelectorAll('.theme-select-btn');
const customHueSlider = document.getElementById('custom-hue-slider');
const hueValueDisplay = document.getElementById('hue-value-display');
const exportBtn     = document.getElementById('export-btn');
const importFile    = document.getElementById('import-file');
const resetBtn      = document.getElementById('reset-btn');

// ─────────────────────────────────────────────────
//  4. UTILITIES — பொதுச் செயல்பாடுகள்
// ─────────────────────────────────────────────────

function save() {
  localStorage.setItem(KEY_TODOS, JSON.stringify(todos));
  localStorage.setItem(KEY_POMO, JSON.stringify(pomoSessions));
  if (customHue !== null) {
    localStorage.setItem(KEY_HUE, customHue);
  } else {
    localStorage.removeItem(KEY_HUE);
  }
}

function getThemeColorAccent() {
  if (customHue !== null) return `hsl(${customHue}, 90%, 58%)`;
  if (theme === 'lime') return '#c8f135';
  if (theme === 'purple') return '#bf55ec';
  if (theme === 'coral') return '#ff5e3a';
  if (theme === 'ocean') return '#00bcd4';
  return '#c8f135';
}

// Toast alerts
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'danger' ? 'toast-danger' : type === 'info' ? 'toast-info' : ''}`;
  toast.style.borderLeftColor = getThemeColorAccent();
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

// Confetti burst
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: [getThemeColorAccent(), '#ffffff', '#222226']
    });
  }
}

// Audio Alerts (Web Audio API)
function playPomoBeep() {
  if (!pomoSound) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.35); // 350ms beep
  } catch (e) {
    console.error("Audio error", e);
  }
}

// Soft Victory Chime when task checked off
function playVictoryChime() {
  if (!pomoSound) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // Double note chime: C5 (523.25Hz) sliding to G5 (783.99Hz)
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error("Web Audio chime error", e);
  }
}

// ─────────────────────────────────────────────────
//  5. CLIENT ROUTER — பக்கங்கள் மாறுதல்
// ─────────────────────────────────────────────────

function switchView(target) {
  currentView = target;
  
  // Update nav buttons active state
  navBtns.forEach(function(btn) {
    if (btn.dataset.target === target) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Toggle page view sections visibility
  pageViews.forEach(function(view) {
    if (view.id === 'view-' + target) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  render();
}

navbar.addEventListener('click', function(e) {
  const btn = e.target.closest('.nav-btn');
  if (btn) switchView(btn.dataset.target);
});

// ─────────────────────────────────────────────────
//  6. THEME MANAGER — வண்ணம் மாற்றுதல்
// ─────────────────────────────────────────────────

function applyTheme(newTheme) {
  theme = newTheme;
  customHue = null; // reset custom hue when choosing preset theme
  localStorage.setItem(KEY_THEME, newTheme);
  
  // Reset previous body classes
  document.body.className = '';
  document.body.classList.add('theme-' + newTheme);

  // Reset document properties to theme defaults
  document.documentElement.style.removeProperty('--accent');
  document.documentElement.style.removeProperty('--accent2');

  // Sync Slider UI display
  customHueSlider.value = 75; // default center position
  hueValueDisplay.textContent = "Preset Accent";
  hueValueDisplay.style.background = "var(--surface2)";
  hueValueDisplay.style.color = "var(--text3)";
  
  // Highlight settings button
  themeBtns.forEach(function(btn) {
    if (btn.dataset.theme === newTheme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Dynamic grid accent adjustments
  document.body.style.backgroundImage = `
    linear-gradient(rgba(${newTheme === 'lime' ? '200,241,53' : newTheme === 'purple' ? '191,85,236' : newTheme === 'coral' ? '255,94,58' : '0,188,212'},0.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(${newTheme === 'lime' ? '200,241,53' : newTheme === 'purple' ? '191,85,236' : newTheme === 'coral' ? '255,94,58' : '0,188,212'},0.012) 1px, transparent 1px)
  `;
}

function applyCustomHue(hue) {
  customHue = hue;
  
  // Update HSL properties on root
  document.documentElement.style.setProperty('--accent', `hsl(${hue}, 90%, 58%)`);
  document.documentElement.style.setProperty('--accent2', `hsl(${hue}, 85%, 48%)`);

  // Sync range slider UI
  customHueSlider.value = hue;
  hueValueDisplay.textContent = `Custom: ${hue}°`;
  hueValueDisplay.style.background = `hsla(${hue}, 90%, 58%, 0.12)`;
  hueValueDisplay.style.color = `hsl(${hue}, 90%, 58%)`;

  // Remove highlight on preset theme buttons
  themeBtns.forEach(function(btn) {
    btn.classList.remove('active');
  });

  // Generic background grid
  document.body.className = '';
  document.body.style.backgroundImage = `
    linear-gradient(rgba(200,241,53,0.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(200,241,53,0.012) 1px, transparent 1px)
  `;
}

themeBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    applyTheme(btn.dataset.theme);
    showToast(`Theme changed to ${btn.textContent.trim()}!`);
    save();
  });
});

// Custom hue slider drag listener
customHueSlider.addEventListener('input', function() {
  applyCustomHue(customHueSlider.value);
  save();
});

// ─────────────────────────────────────────────────
//  7. POMODORO TIMER LOGIC
// ─────────────────────────────────────────────────

function updatePomoDisplay() {
  const m = Math.floor(pomoTimeLeft / 60);
  const s = pomoTimeLeft % 60;
  pomoTime.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;

  // Ring circular animation calculations
  const total = pomoMode === 'work' ? pomoWorkMins * 60 : pomoBreakMins * 60;
  const pct = pomoTimeLeft / total;
  const offset = 452.389 * (1 - pct); // circumference is 452.389 (r=72)
  pomoCircle.style.strokeDashoffset = offset;
}

function togglePomo() {
  if (pomoIsRunning) {
    // PAUSE
    clearInterval(pomoTimer);
    pomoIsRunning = false;
    pomoPlayBtn.textContent = '▶ Start';
    showToast("Timer paused", "info");
  } else {
    // START
    pomoIsRunning = true;
    pomoPlayBtn.textContent = '⏸ Pause';
    pomoSettings.style.display = 'none'; // Hide settings inputs when running
    showToast(`Timer started - ${pomoMode === 'work' ? 'Work hard!' : 'Rest well!'}`);
    
    pomoTimer = setInterval(function() {
      pomoTimeLeft--;
      if (pomoTimeLeft <= 0) {
        clearInterval(pomoTimer);
        playPomoBeep();
        
        if (pomoMode === 'work') {
          pomoMode = 'break';
          pomoTimeLeft = pomoBreakMins * 60;
          pomoStatus.textContent = 'Break Time';
          pomoStatus.style.background = 'rgba(0, 188, 212, 0.1)';
          pomoStatus.style.color = '#00bcd4';
          
          pomoSessions.push(Date.now()); // LOG SESSION COMPLETED!
          save();
          renderDashboard();
          
          showToast("Work session done! Relax.", "info");
          triggerConfetti();
        } else {
          pomoMode = 'work';
          pomoTimeLeft = pomoWorkMins * 60;
          pomoStatus.textContent = 'Work Session';
          pomoStatus.style.background = 'rgba(200, 241, 53, 0.1)';
          pomoStatus.style.color = 'var(--accent)';
          showToast("Break over! Time to focus.", "info");
        }
        pomoIsRunning = false;
        pomoPlayBtn.textContent = '▶ Start';
        pomoSettings.style.display = 'flex'; // Show settings inputs when finished
      }
      updatePomoDisplay();
    }, 1000);
  }
}

function resetPomo() {
  clearInterval(pomoTimer);
  pomoIsRunning = false;
  pomoMode = 'work';
  pomoTimeLeft = pomoWorkMins * 60;
  pomoStatus.textContent = 'Work Session';
  pomoStatus.style.background = 'rgba(200, 241, 53, 0.1)';
  pomoStatus.style.color = 'var(--accent)';
  pomoPlayBtn.textContent = '▶ Start';
  pomoSettings.style.display = 'flex'; // Show settings inputs
  updatePomoDisplay();
}

// Timer input listeners
pomoWorkInput.addEventListener('input', function() {
  const v = parseInt(pomoWorkInput.value);
  if (v > 0 && v <= 120) {
    pomoWorkMins = v;
    if (pomoMode === 'work' && !pomoIsRunning) {
      pomoTimeLeft = pomoWorkMins * 60;
      updatePomoDisplay();
    }
  }
});

pomoBreakInput.addEventListener('input', function() {
  const v = parseInt(pomoBreakInput.value);
  if (v > 0 && v <= 60) {
    pomoBreakMins = v;
    if (pomoMode === 'break' && !pomoIsRunning) {
      pomoTimeLeft = pomoBreakMins * 60;
      updatePomoDisplay();
    }
  }
});

pomoPlayBtn.addEventListener('click', togglePomo);
pomoResetBtn.addEventListener('click', resetPomo);

pomoSoundBtn.addEventListener('click', function() {
  pomoSound = !pomoSound;
  pomoSoundBtn.textContent = pomoSound ? '🔊 Sound On' : '🔇 Muted';
  showToast(pomoSound ? "Alert sound enabled" : "Alert sound muted", "info");
});

// ─────────────────────────────────────────────────
//  8. TASK CRUD OPERATIONS
// ─────────────────────────────────────────────────

function addTodo() {
  const text = newTaskInput.value.trim();
  if (!text) {
    newTaskInput.focus();
    return;
  }

  const cat  = taskCategory.value;
  const prio = taskPriority.value;
  const due  = taskDueDate.value || null;

  todos.unshift({
    id: Date.now().toString(36),
    text: text,
    completed: false,
    priority: prio,
    category: cat,
    dueDate: due,
    notes: '',
    subtasks: [],
    createdAt: Date.now(),
    completedAt: null
  });

  newTaskInput.value = '';
  taskDueDate.value = '';
  save();
  render();
  showToast("Task added successfully!");
}

function deleteTodo(id) {
  todos = todos.filter(function(t) { return t.id !== id; });
  save();
  render();
  showToast("Task deleted", "danger");
}

function toggleTodo(id) {
  const todo = todos.find(function(t) { return t.id === id; });
  if (todo) {
    todo.completed = !todo.completed;
    todo.completedAt = todo.completed ? Date.now() : null; // log completion date
    save();
    render();
    
    if (todo.completed) {
      showToast("Task marked completed!");
      playVictoryChime(); // Play synthesized soft chime sound!
      
      // Celebrate if all active tasks are done
      const activeCount = todos.filter(function(t) { return !t.completed; }).length;
      if (activeCount === 0 && todos.length > 0) {
        triggerConfetti();
        showToast("All tasks completed! Excellent work!", "info");
      }
    }
  }
}

function clearCompleted() {
  const initialLen = todos.length;
  todos = todos.filter(function(t) { return !t.completed; });
  save();
  render();
  
  if (todos.length < initialLen) {
    showToast("Cleared completed tasks");
    triggerConfetti();
  }
}

function startEdit(id) {
  editingId = id;
  render();
  const input = todoList.querySelector('.edit-input');
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

function saveEdit(id, newText) {
  const trimmed = newText.trim();
  if (trimmed) {
    const todo = todos.find(function(t) { return t.id === id; });
    if (todo) todo.text = trimmed;
  }
  editingId = null;
  save();
  render();
  showToast("Task text updated");
}

// Details expansions (notes/subtasks)
function toggleExpand(id) {
  const idx = expandedIds.indexOf(id);
  if (idx === -1) {
    expandedIds.push(id);
  } else {
    expandedIds.splice(idx, 1);
  }
  render();
}

function saveNotes(id, text) {
  const todo = todos.find(function(t) { return t.id === id; });
  if (todo) {
    todo.notes = text;
    save(); // save to localStorage silently
  }
}

// Subtasks CRUD
function addSubtask(todoId, inputEl) {
  const text = inputEl.value.trim();
  if (!text) {
    inputEl.focus();
    return;
  }

  const todo = todos.find(function(t) { return t.id === todoId; });
  if (todo) {
    todo.subtasks.push({
      id: Date.now().toString(36),
      text: text,
      completed: false
    });
    inputEl.value = '';
    save();
    render();
    showToast("Subtask added");
  }
}

function toggleSubtask(todoId, subtaskId) {
  const todo = todos.find(function(t) { return t.id === todoId; });
  if (todo) {
    const sub = todo.subtasks.find(function(s) { return s.id === subtaskId; });
    if (sub) {
      sub.completed = !sub.completed;
      save();
      render();
    }
  }
}

function deleteSubtask(todoId, subtaskId) {
  const todo = todos.find(function(t) { return t.id === todoId; });
  if (todo) {
    todo.subtasks = todo.subtasks.filter(function(s) { return s.id !== subtaskId; });
    save();
    render();
    showToast("Subtask deleted", "danger");
  }
}

// ─────────────────────────────────────────────────
//  9. SEARCH, SORT & FILTER SELECTION
// ─────────────────────────────────────────────────

function getFilteredAndSorted() {
  let filtered = todos;

  // status filter
  if (filter === 'active') {
    filtered = filtered.filter(function(t) { return !t.completed; });
  } else if (filter === 'completed') {
    filtered = filtered.filter(function(t) { return t.completed; });
  }

  // search query filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(function(t) {
      return t.text.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q);
    });
  }

  // sort tasks
  filtered.sort(function(a, b) {
    if (sortBy === 'date-desc') return b.createdAt - a.createdAt;
    if (sortBy === 'date-asc')  return a.createdAt - b.createdAt;
    if (sortBy === 'due-date') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority-desc') {
      const pVal = { high: 3, medium: 2, low: 1 };
      return pVal[b.priority] - pVal[a.priority];
    }
    return 0;
  });

  return filtered;
}

// ─────────────────────────────────────────────────
//  9b. WEEKLY SVG CHART GENERATOR
// ─────────────────────────────────────────────────

function renderWeeklyChart() {
  if (!chartContainer) return;

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const counts = [];
  const labels = [];
  
  // Collect data for the last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    
    const count = todos.filter(function(t) {
      if (!t.completed || !t.completedAt) return false;
      const compDate = new Date(t.completedAt);
      compDate.setHours(0, 0, 0, 0);
      return compDate.getTime() === d.getTime();
    }).length;
    
    counts.push(count);
    labels.push(weekdays[d.getDay()]);
  }

  let maxVal = Math.max(...counts);
  if (maxVal === 0) maxVal = 4; // default max scale

  let svgHtml = `
    <svg viewBox="0 0 320 140" width="100%" height="100%" style="overflow: visible;">
      <!-- Grid lines -->
      <line x1="20" y1="20" x2="300" y2="20" class="chart-grid-line" />
      <line x1="20" y1="50" x2="300" y2="50" class="chart-grid-line" />
      <line x1="20" y1="80" x2="300" y2="80" class="chart-grid-line" />
      <line x1="20" y1="110" x2="300" y2="110" class="chart-axis-line" />
  `;

  for (let i = 0; i < 7; i++) {
    const count = counts[i];
    const label = labels[i];
    const x = 38 + i * 39;
    const barHeight = (count / maxVal) * 80;
    const y = 110 - barHeight;
    const rectX = x - 10;

    if (count > 0) {
      svgHtml += `
        <rect x="${rectX}" y="${y}" width="20" height="${barHeight}" rx="4" class="chart-bar" />
        <text x="${x}" y="${y - 6}" class="chart-label-val">${count}</text>
      `;
    }
    svgHtml += `
      <text x="${x}" y="126" class="chart-label">${label}</text>
    `;
  }

  svgHtml += `</svg>`;
  chartContainer.innerHTML = svgHtml;
}

// ─────────────────────────────────────────────────
//  9c. DAILY MOTIVATIONAL QUOTES LOGGER
// ─────────────────────────────────────────────────

function renderQuote() {
  if (!quoteText || !quoteAuthor) return;
  // Quote changes based on day of the year
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const index = dayOfYear % MOTIVATIONAL_QUOTES.length;
  const q = MOTIVATIONAL_QUOTES[index];
  
  quoteText.textContent = `“${q.text}”`;
  quoteAuthor.textContent = `— ${q.author}`;
}

// ─────────────────────────────────────────────────
//  10. DYNAMIC RENDER ENGINES (DASHBOARD & TASKS)
// ─────────────────────────────────────────────────

function renderDashboard() {
  usernameDisp.textContent = username;
  
  // Formatted date string
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDate.textContent = new Date().toLocaleDateString('en-US', options);

  // Stats
  const activeCount = todos.filter(function(t) { return !t.completed; }).length;
  const doneCount   = todos.filter(function(t) { return t.completed; }).length;
  const urgentCount = todos.filter(function(t) { return t.priority === 'high' && !t.completed; }).length;

  // Completed Pomodoros Today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const pomoCountToday = pomoSessions.filter(function(ts) {
    return ts >= todayStart.getTime();
  }).length;

  dashTotal.textContent  = todos.length;
  dashActive.textContent = activeCount;
  dashDone.textContent   = doneCount;
  dashUrgent.textContent = urgentCount;
  dashPomoCount.textContent = pomoCountToday;

  // Render quotes and activity charts
  renderQuote();
  renderWeeklyChart();

  // Category progress calculations
  const categories = [
    { id: 'personal', name: '🏠 Personal', color: '#00bcd4' },
    { id: 'work', name: '💼 Work', color: '#bf55ec' },
    { id: 'shopping', name: '🛒 Shopping', color: '#ff5e3a' },
    { id: 'ideas', name: '💡 Ideas', color: 'var(--accent)' }
  ];

  catProgress.innerHTML = categories.map(function(cat) {
    const catTasks = todos.filter(function(t) { return t.category === cat.id; });
    const catDone  = catTasks.filter(function(t) { return t.completed; }).length;
    const pct      = catTasks.length ? Math.round((catDone / catTasks.length) * 100) : 0;

    return `
      <div class="category-progress-item">
        <div class="cat-progress-meta">
          <span class="cat-progress-name">${cat.name}</span>
          <span class="cat-progress-count">${catDone}/${catTasks.length} (${pct}%)</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${pct}%; background: ${cat.color};"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderTasksList() {
  const filtered = getFilteredAndSorted();
  const activeCount = todos.filter(function(t) { return !t.completed; }).length;
  const doneCount   = todos.filter(function(t) { return t.completed; }).length;

  // task list counters
  if (statsBar) {
    statsBar.style.display = todos.length ? 'flex' : 'none';
    statTotal.textContent  = todos.length;
    statActive.textContent = activeCount;
    statDone.textContent   = doneCount;
  }
  
  countLabel.textContent  = activeCount + ' item(s) left';
  bottomBar.style.display = todos.length ? 'flex' : 'none';

  // empty states
  if (filtered.length === 0) {
    const msgs = {
      all:       { icon: '📋', text: 'No tasks found. Create one above!' },
      active:    { icon: '🎉', text: 'All active tasks completed!' },
      completed: { icon: '⏳', text: 'No completed tasks yet.' }
    };
    const m = msgs[filter];
    todoList.innerHTML = `
      <div class="empty">
        <div class="empty-icon">${m.icon}</div>
        <p>${m.text}</p>
      </div>
    `;
    return;
  }

  // Generate todo element HTML strings
  todoList.innerHTML = filtered.map(function(todo) {
    const isEditing = todo.id === editingId;
    const isExpanded = expandedIds.includes(todo.id);
    
    let subtaskHtml = '';
    if (isExpanded) {
      const subItems = todo.subtasks.map(function(sub) {
        return `
          <div class="subtask-item ${sub.completed ? 'completed' : ''}">
            <div class="subtask-check ${sub.completed ? 'done' : ''}" 
                 data-action="toggle-subtask" data-id="${todo.id}" data-sub-id="${sub.id}">
              ${sub.completed ? '✓' : ''}
            </div>
            <span class="subtask-text">${sub.text}</span>
            <button class="subtask-del" data-action="delete-subtask" data-id="${todo.id}" data-sub-id="${sub.id}">✕</button>
          </div>
        `;
      }).join('');

      subtaskHtml = `
        <div class="todo-details">
          <div class="subtasks-header">Checklist</div>
          <div class="subtasks-list">
            ${subItems || '<p style="font-size:11px; color:var(--text3);">No subtasks yet.</p>'}
          </div>
          <div class="subtask-creator">
            <input class="subtask-input" placeholder="Add subtask..." data-todo-id="${todo.id}" />
            <button class="subtask-add-btn" data-action="add-subtask" data-id="${todo.id}">Add</button>
          </div>
          <div class="notes-wrapper">
            <div class="notes-label">Notes</div>
            <textarea class="notes-textarea" data-id="${todo.id}" placeholder="Type notes here...">${todo.notes}</textarea>
          </div>
        </div>
      `;
    }

    // priority emoji
    const prioLabels = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };
    const catLabels = { personal: '🏠 Personal', work: '💼 Work', shopping: '🛒 Shopping', ideas: '💡 Ideas' };

    // Format date tag
    let dateHtml = '';
    if (todo.dueDate) {
      const dateObj = new Date(todo.dueDate);
      const isOverdue = !todo.completed && dateObj < new Date().setHours(0,0,0,0);
      dateHtml = `<span class="todo-date-tag" style="${isOverdue ? 'color:var(--danger);font-weight:700;' : ''}">📅 ${todo.dueDate}</span>`;
    }

    // Subtasks inline progress bar calculation
    let progressHtml = '';
    if (todo.subtasks && todo.subtasks.length > 0) {
      const completedSub = todo.subtasks.filter(function(s) { return s.completed; }).length;
      const pct = Math.round((completedSub / todo.subtasks.length) * 100);
      progressHtml = `
        <div class="todo-progress-container">
          <div class="todo-progress-bar">
            <div class="todo-progress-fill" style="width: ${pct}%;"></div>
          </div>
          <span class="todo-progress-text">${completedSub}/${todo.subtasks.length}</span>
        </div>
      `;
    }

    if (isEditing) {
      return `
        <div class="todo-item editing">
          <div class="todo-main-row">
            <div class="check-btn ${todo.completed ? 'done' : ''}" data-action="toggle" data-id="${todo.id}">
              ${todo.completed ? '✓' : ''}
            </div>
            <div class="todo-content">
              <input class="edit-input" data-id="${todo.id}" value="${todo.text.replace(/"/g, '&quot;')}" />
            </div>
            <button class="del-btn save" data-action="save-edit" data-id="${todo.id}">💾</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="todo-item ${todo.completed ? 'completed' : ''}">
        <div class="todo-main-row">
          <div class="check-btn ${todo.completed ? 'done' : ''}" data-action="toggle" data-id="${todo.id}">
            ${todo.completed ? '✓' : ''}
          </div>
          <div class="todo-content" data-action="expand" data-id="${todo.id}">
            <span class="todo-text">${todo.text}</span>
            <div class="todo-meta-tags">
              <span class="todo-badge cat-${todo.category}">${catLabels[todo.category]}</span>
              <span class="todo-badge prio-${todo.priority}">${prioLabels[todo.priority]}</span>
              ${dateHtml}
            </div>
            ${progressHtml}
          </div>
          <button class="del-btn" data-action="delete" data-id="${todo.id}">✕</button>
        </div>
        ${subtaskHtml}
      </div>
    `;
  }).join('');
}

function render() {
  if (currentView === 'dashboard') {
    renderDashboard();
  } else if (currentView === 'tasks') {
    renderTasksList();
  }
}

// ─────────────────────────────────────────────────
//  11. DELEGATED EVENT LISTENERS (TODO LIST CLICKS)
// ─────────────────────────────────────────────────

todoList.addEventListener('click', function(e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;

  const action = el.dataset.action;
  const id     = el.dataset.id;
  const subId  = el.dataset.subId;

  if (action === 'toggle')    toggleTodo(id);
  if (action === 'delete')    deleteTodo(id);
  if (action === 'expand')    toggleExpand(id);
  
  if (action === 'save-edit') {
    const input = todoList.querySelector('.edit-input');
    if (input) saveEdit(id, input.value);
  }

  // subtask actions
  if (action === 'toggle-subtask') toggleSubtask(id, subId);
  if (action === 'delete-subtask') deleteSubtask(id, subId);
  if (action === 'add-subtask') {
    const input = todoList.querySelector(`.subtask-input[data-todo-id="${id}"]`);
    if (input) addSubtask(id, input);
  }
});

// Double click to edit task text
todoList.addEventListener('dblclick', function(e) {
  const textEl = e.target.closest('.todo-text');
  if (textEl) {
    const itemEl = textEl.closest('[data-id]');
    if (itemEl) startEdit(itemEl.dataset.id);
  }
});

// Keyboard actions inside todoList list inputs
todoList.addEventListener('keydown', function(e) {
  // Save or cancel edit input
  if (e.target.classList.contains('edit-input')) {
    if (e.key === 'Enter') saveEdit(e.target.dataset.id, e.target.value);
    if (e.key === 'Escape') {
      editingId = null;
      render();
    }
  }

  // Add subtask on Enter
  if (e.target.classList.contains('subtask-input') && e.key === 'Enter') {
    const id = e.target.dataset.todoId;
    addSubtask(id, e.target);
  }
});

// Auto-save edit when focus out
todoList.addEventListener('focusout', function(e) {
  if (e.target.classList.contains('edit-input')) {
    setTimeout(function() {
      if (editingId === e.target.dataset.id) {
        saveEdit(e.target.dataset.id, e.target.value);
      }
    }, 100);
  }
  
  // Save notes on focus out
  if (e.target.classList.contains('notes-textarea')) {
    saveNotes(e.target.dataset.id, e.target.value);
  }
});

// ─────────────────────────────────────────────────
//  12. CREATOR CONTROLS
// ─────────────────────────────────────────────────

// Add Task
addBtn.addEventListener('click', addTodo);
newTaskInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addTodo();
});

// Toggle creator options details
toggleAdvBtn.addEventListener('click', function() {
  const isHidden = advOptions.style.display === 'none';
  advOptions.style.display = isHidden ? 'grid' : 'none';
  toggleAdvBtn.textContent = isHidden ? '⚙️ Hide Details' : '⚙️ Show Details';
});

// ─────────────────────────────────────────────────
//  13. TOOLBAR CONTROLS
// ─────────────────────────────────────────────────

searchInput.addEventListener('input', function() {
  searchQuery = searchInput.value;
  renderTasksList();
});

sortSelect.addEventListener('change', function() {
  sortBy = sortSelect.value;
  renderTasksList();
});

filterBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    filter = btn.dataset.filter;
    filterBtns.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    renderTasksList();
  });
});

clearBtn.addEventListener('click', clearCompleted);

// ─────────────────────────────────────────────────
//  14. SETTINGS CONTROLS
// ─────────────────────────────────────────────────

saveUserBtn.addEventListener('click', function() {
  const name = usernameInput.value.trim();
  if (name) {
    username = name;
    localStorage.setItem(KEY_USER, name);
    showToast("Profile name updated!");
    renderDashboard();
  }
});

// Export backup file
exportBtn.addEventListener('click', function() {
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(todos, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", `do_tasks_backup_${Date.now()}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    showToast("Tasks backup exported!");
  } catch (err) {
    showToast("Export failed", "danger");
  }
});

// Import backup file
importFile.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const parsed = JSON.parse(evt.target.result);
      if (Array.isArray(parsed)) {
        todos = parsed.map(function(todo) {
          return {
            id: todo.id || Date.now().toString(36),
            text: todo.text || 'Imported Task',
            completed: typeof todo.completed === 'boolean' ? todo.completed : false,
            priority: todo.priority || 'medium',
            category: todo.category || 'personal',
            dueDate: todo.dueDate || null,
            notes: todo.notes || '',
            subtasks: Array.isArray(todo.subtasks) ? todo.subtasks : [],
            createdAt: todo.createdAt || Date.now(),
            completedAt: todo.completedAt || (todo.completed ? todo.createdAt || Date.now() : null)
          };
        });
        save();
        render();
        showToast(`Imported ${todos.length} tasks!`);
      } else {
        showToast("Invalid data structure", "danger");
      }
    } catch (err) {
      showToast("Failed to parse JSON backup", "danger");
    }
  };
  reader.readAsText(file);
  importFile.value = ''; // clear selector
});

// Reset app
resetBtn.addEventListener('click', function() {
  if (confirm("⚠️ Are you sure you want to delete all tasks and reset themes? This cannot be undone!")) {
    todos = [];
    username = 'Productive User';
    theme = 'lime';
    pomoSessions = [];
    customHue = null;
    localStorage.removeItem(KEY_TODOS);
    localStorage.removeItem(KEY_USER);
    localStorage.removeItem(KEY_THEME);
    localStorage.removeItem(KEY_POMO);
    localStorage.removeItem(KEY_HUE);
    
    applyTheme('lime');
    usernameInput.value = '';
    resetPomo();
    save();
    render();
    showToast("Application completely reset", "danger");
  }
});

// ─────────────────────────────────────────────────
//  15. INITIALIZATION ON LOAD
// ─────────────────────────────────────────────────

// Sync UI inputs with storage state
usernameInput.value = username;

if (customHue !== null) {
  applyCustomHue(parseInt(customHue));
} else {
  applyTheme(theme);
}

resetPomo();
render();
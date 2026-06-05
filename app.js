// ─────────────────────────────────────────────────
//  1. STATE — app-ஓட data இங்க வாழுது
// ─────────────────────────────────────────────────

const KEY = 'my_todos';                                    // localStorage key
let todos     = JSON.parse(localStorage.getItem(KEY) || '[]'); // load saved data
let filter    = 'all';                                         // current filter
let editingId = null;                                          // இப்ப edit ஆகுற todo id


// ─────────────────────────────────────────────────
//  2. DOM REFERENCES — HTML elements grab பண்றோம்
// ─────────────────────────────────────────────────

const newTaskInput = document.getElementById('new-task');
const addBtn       = document.getElementById('add-btn');
const todoList     = document.getElementById('todo-list');
const bottomBar    = document.getElementById('bottom-bar');
const countLabel   = document.getElementById('count-label');
const clearBtn     = document.getElementById('clear-btn');
const filterBtns   = document.querySelectorAll('.filter-btn');


// ─────────────────────────────────────────────────
//  3. SAVE — localStorage-ல write பண்றோம்
// ─────────────────────────────────────────────────

function save() {
  localStorage.setItem(KEY, JSON.stringify(todos));
}


// ─────────────────────────────────────────────────
//  4. GENERATE ID — ஒவ்வொரு todo-க்கும் unique id
// ─────────────────────────────────────────────────

function genId() {
  return Date.now().toString(36);
}


// ─────────────────────────────────────────────────
//  5. CREATE — புது task add பண்றது
// ─────────────────────────────────────────────────

function addTodo() {
  const text = newTaskInput.value.trim();

  if (!text) {
    newTaskInput.focus(); // empty-ஆ இருந்தா focus குடு
    return;
  }

  todos.unshift({          // முன்னால insert பண்றோம்
    id: genId(),
    text: text,
    completed: false
  });

  newTaskInput.value = ''; // input clear
  save();
  render();
}


// ─────────────────────────────────────────────────
//  6. DELETE — task remove பண்றது
// ─────────────────────────────────────────────────

function deleteTodo(id) {
  todos = todos.filter(function(todo) {
    return todo.id !== id;  // match ஆனது மட்டும் remove
  });
  save();
  render();
}


// ─────────────────────────────────────────────────
//  7. UPDATE — complete / incomplete toggle பண்றது
// ─────────────────────────────────────────────────

function toggleTodo(id) {
  const todo = todos.find(function(todo) {
    return todo.id === id;
  });

  if (todo) {
    todo.completed = !todo.completed; // true → false, false → true
  }

  save();
  render();
}


// ─────────────────────────────────────────────────
//  8. CLEAR COMPLETED — done ஆனவை எல்லாம் delete
// ─────────────────────────────────────────────────

function clearCompleted() {
  todos = todos.filter(function(todo) {
    return !todo.completed;
  });
  save();
  render();
}


// ─────────────────────────────────────────────────
//  8b. EDIT — task text மாத்றது
// ─────────────────────────────────────────────────

function startEdit(id) {
  editingId = id;   // இந்த id-ஓட todo edit mode-ல போகும்
  render();         // re-render — input box காட்டும்

  // input-ஐ focus பண்ணி cursor-ஐ கடைசியில வை
  var input = document.querySelector('.edit-input');
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

function saveEdit(id, newText) {
  var trimmed = newText.trim();

  if (trimmed) {                              // empty-ஆ இல்லன்னா மட்டும் save
    var todo = todos.find(function(t) { return t.id === id; });
    if (todo) todo.text = trimmed;
  }

  editingId = null;  // edit mode off
  save();
  render();
}


// ─────────────────────────────────────────────────
//  9. FILTER — எந்த todos காட்டணும்னு decide பண்றது
// ─────────────────────────────────────────────────

function getFiltered() {
  if (filter === 'active') {
    return todos.filter(function(todo) { return !todo.completed; });
  }
  if (filter === 'completed') {
    return todos.filter(function(todo) { return todo.completed; });
  }
  return todos; // 'all' — எல்லாத்தையும் return
}


// ─────────────────────────────────────────────────
//  10. RENDER — screen update பண்றது (READ)
// ─────────────────────────────────────────────────

function render() {
  const filtered    = getFiltered();
  const activeCount = todos.filter(function(t) { return !t.completed; }).length;
  const doneCount   = todos.filter(function(t) { return t.completed; }).length;

  // stats bar
  const statsBar = document.getElementById('stats-bar');
  if (statsBar) {
    statsBar.style.display = todos.length ? 'flex' : 'none';
    document.getElementById('stat-total').textContent  = todos.length;
    document.getElementById('stat-active').textContent = activeCount;
    document.getElementById('stat-done').textContent   = doneCount;
  }

  // bottom bar
  countLabel.textContent    = activeCount + ' item(s) left';
  bottomBar.style.display   = todos.length ? 'flex' : 'none';

  // empty state
  if (filtered.length === 0) {
    const msgs = {
      all:       { icon: '📋', text: 'No tasks yet. Add one above!' },
      active:    { icon: '🎉', text: 'All tasks completed!' },
      completed: { icon: '⏳', text: 'No completed tasks yet.' }
    };
    const m = msgs[filter];
    todoList.innerHTML =
      '<div class="empty">' +
        '<div class="empty-icon">' + m.icon + '</div>' +
        '<p>' + m.text + '</p>' +
      '</div>';
    return;
  }

  // todo items HTML build பண்றோம்
  todoList.innerHTML = filtered.map(function(todo) {

    // EDIT MODE — இந்த todo edit ஆகுதா?
    if (todo.id === editingId) {
      return (
        '<div class="todo-item editing">' +
          '<div class="check-btn ' + (todo.completed ? 'done' : '') + '" ' +
               'data-action="toggle" data-id="' + todo.id + '">' +
            (todo.completed ? '✓' : '') +
          '</div>' +
          '<input class="edit-input" data-id="' + todo.id + '" ' +
                 'value="' + todo.text.replace(/"/g, '&quot;') + '" />' +
          '<button class="del-btn save" data-action="save-edit" data-id="' + todo.id + '">💾</button>' +
        '</div>'
      );
    }

    // NORMAL MODE
    return (
      '<div class="todo-item ' + (todo.completed ? 'completed' : '') + '">' +

        '<div class="check-btn ' + (todo.completed ? 'done' : '') + '" ' +
             'data-action="toggle" data-id="' + todo.id + '">' +
          (todo.completed ? '✓' : '') +
        '</div>' +

        '<span class="todo-text" data-action="edit" data-id="' + todo.id + '">' +
          todo.text +
        '</span>' +

        '<button class="del-btn" data-action="delete" data-id="' + todo.id + '">' +
          '✕' +
        '</button>' +

      '</div>'
    );
  }).join('');
}


// ─────────────────────────────────────────────────
//  11. EVENT DELEGATION — todo list-ஓட clicks handle
// ─────────────────────────────────────────────────

todoList.addEventListener('click', function(e) {
  const el = e.target.closest('[data-action]'); // clicked element find பண்றோம்
  if (!el) return;                               // outside click — ignore

  const action = el.dataset.action;
  const id     = el.dataset.id;

  if (action === 'toggle')    toggleTodo(id);
  if (action === 'delete')    deleteTodo(id);
  if (action === 'edit')      startEdit(id);        // text click → edit mode
  if (action === 'save-edit') {                     // 💾 click → save
    var input = todoList.querySelector('.edit-input');
    if (input) saveEdit(id, input.value);
  }
});

// Edit input-ல keyboard events
// Enter → save, Escape → cancel
todoList.addEventListener('keydown', function(e) {
  if (!e.target.classList.contains('edit-input')) return;

  if (e.key === 'Enter') {
    saveEdit(e.target.dataset.id, e.target.value);
  }
  if (e.key === 'Escape') {
    editingId = null; // cancel — original text திரும்பும்
    render();
  }
});

// Edit input-ல focusout event (வெளிய கிளிக் பண்ணா auto-save ஆகும்)
todoList.addEventListener('focusout', function(e) {
  if (!e.target.classList.contains('edit-input')) return;

  // Escape key cancel அல்லது வேறு action நடக்க டைம் குடுக்க 100ms delay
  setTimeout(function() {
    if (editingId === e.target.dataset.id) {
      saveEdit(e.target.dataset.id, e.target.value);
    }
  }, 100);
});


// ─────────────────────────────────────────────────
//  12. ADD BUTTON & ENTER KEY
// ─────────────────────────────────────────────────

addBtn.addEventListener('click', addTodo);

newTaskInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addTodo();
});


// ─────────────────────────────────────────────────
//  13. FILTER BUTTONS
// ─────────────────────────────────────────────────

filterBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    filter = btn.dataset.filter; // 'all' / 'active' / 'completed'

    // active class update பண்றோம்
    filterBtns.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');

    render();
  });
});


// ─────────────────────────────────────────────────
//  14. CLEAR COMPLETED BUTTON
// ─────────────────────────────────────────────────

clearBtn.addEventListener('click', clearCompleted);


// ─────────────────────────────────────────────────
//  15. INITIAL RENDER — page load-ல முதல் render
// ─────────────────────────────────────────────────

render();
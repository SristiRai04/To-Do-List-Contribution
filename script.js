const input = document.querySelector('#todo-input');
const submitBtn = document.querySelector('#submit');
const list = document.querySelector('.todo-lists');

// Load todos
window.addEventListener('DOMContentLoaded', () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.forEach(todo => createTodo(todo.text, todo.completed));
  updateProgress();
});

// Add task
submitBtn.addEventListener('click', addTodo);

input.addEventListener('keypress', (e) => {
  if (e.key === "Enter") addTodo();
});

function addTodo() {
  const value = input.value.trim();

  if (!value) {
    alert("Task cannot be empty!");
    return;
  }

  createTodo(value, false);
  saveTodo(value, false);
  input.value = "";
  updateProgress();
}

function createTodo(text, completed) {
  const todo = document.createElement('div');
  todo.classList.add('todo-item');

  const content = document.createElement('div');
  const textInput = document.createElement('input');

  textInput.value = text;
  textInput.classList.add('text');
  textInput.setAttribute('readonly', 'readonly');

  if (completed) textInput.classList.add('done');

  content.appendChild(textInput);

  const actions = document.createElement('div');

  const doneBtn = document.createElement('i');
  doneBtn.classList.add('fa-solid', 'fa-check');

  const editBtn = document.createElement('i');
  editBtn.classList.add('fa-solid', 'fa-pen-to-square', 'edit');

  const deleteBtn = document.createElement('i');
  deleteBtn.classList.add('fa-solid', 'fa-trash');

  actions.append(doneBtn, editBtn, deleteBtn);
  todo.append(content, actions);
  list.appendChild(todo);

  // Done
  doneBtn.addEventListener('click', () => {
    textInput.classList.toggle('done');
    updateLocalStorage();
    updateProgress();
  });

  // Edit
  editBtn.addEventListener('click', () => {
    if (editBtn.classList.contains('edit')) {
      editBtn.classList.replace('edit', 'save');
      editBtn.classList.replace('fa-pen-to-square', 'fa-x');
      textInput.removeAttribute('readonly');
      textInput.focus();
    } else {
      editBtn.classList.replace('save', 'edit');
      editBtn.classList.replace('fa-x', 'fa-pen-to-square');
      textInput.setAttribute('readonly', 'readonly');
      updateLocalStorage();
    }
  });

  // Delete
  deleteBtn.addEventListener('click', () => {
    todo.remove();
    updateLocalStorage();
    updateProgress();
  });
}

// Save
function saveTodo(text, completed) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push({ text, completed });
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Update
function updateLocalStorage() {
  const todoElements = document.querySelectorAll('.todo-item');
  const todos = [];

  todoElements.forEach(todo => {
    const text = todo.querySelector('.text').value;
    const completed = todo.querySelector('.text').classList.contains('done');
    todos.push({ text, completed });
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

// Progress
function updateProgress() {
  const total = document.querySelectorAll('.todo-item').length;
  const completed = document.querySelectorAll('.text.done').length;

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById('progress-text').innerText =
    `Progress: ${percent}% (${completed}/${total})`;
}

// 🔍 Search
document.getElementById('search').addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase();
  document.querySelectorAll('.todo-item').forEach(todo => {
    const text = todo.querySelector('.text').value.toLowerCase();
    todo.style.display = text.includes(value) ? 'flex' : 'none';
  });
});

// 🎯 Filter
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.filter;

    document.querySelectorAll('.todo-item').forEach(todo => {
      const done = todo.querySelector('.text').classList.contains('done');

      if (type === "all") {
        todo.style.display = 'flex';
      } else if (type === "completed" && done) {
        todo.style.display = 'flex';
      } else if (type === "pending" && !done) {
        todo.style.display = 'flex';
      } else {
        todo.style.display = 'none';
      }
    });
  });
});

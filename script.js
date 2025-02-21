fetchTodos();

let todos = [];
let currentPage = 1;
const todosPerPage = 10;

async function fetchTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  todos = await response.json();
  renderTodos();
}

function renderTodos() {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";

  const start = (currentPage - 1) * todosPerPage;
  const end = start + todosPerPage;
  const paginatedTodos = todos.slice(start, end);

  paginatedTodos.forEach((todo, index) => {
    const todoItem = document.createElement("div");
    todoItem.className = `todo-item ${todo.completed ? "done" : ""}`;
    todoItem.innerHTML = `
      <span>${todo.title}</span>
      <button onclick="markAsDone(${todo.id})">Check</button>
      <button onclick="showUpdateModal(${todo.id})">Update</button>
      <button onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    todoList.appendChild(todoItem);
  });
}

// Pagination
document.getElementById("next-page").addEventListener("click", () => {
  if (currentPage * todosPerPage < todos.length) {
    currentPage++;
    renderTodos();
  }
});

document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTodos();
  }
});

async function markAsDone(todoId) {
  const todo = todos.find((t) => t.id === todoId);
  todo.completed = !todo.completed;
  await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
    method: "PUT",
    body: JSON.stringify(todo),
    headers: { "Content-Type": "application/json" },
  });
  renderTodos();
}

async function deleteTodo(todoId) {
  await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
    method: "DELETE",
  });
  todos = todos.filter((t) => t.id !== todoId);
  renderTodos();
}

let updatingTodoId = null;

function showUpdateModal(todoId) {
  updatingTodoId = todoId;
  const modal = document.getElementById("update-modal");
  modal.style.display = "block";
  const todo = todos.find((t) => t.id === todoId);
  document.getElementById("update-title").value = todo.title;
}

document.getElementById("cancel-update").addEventListener("click", () => {
  document.getElementById("update-modal").style.display = "none";
});

document.getElementById("save-update").addEventListener("click", async () => {
  const newTitle = document.getElementById("update-title").value;
  const todo = todos.find((t) => t.id === updatingTodoId);
  todo.title = newTitle;
  await fetch(`https://jsonplaceholder.typicode.com/todos/${updatingTodoId}`, {
    method: "PUT",
    body: JSON.stringify(todo),
    headers: { "Content-Type": "application/json" },
  });
  document.getElementById("update-modal").style.display = "none";
  renderTodos();
});

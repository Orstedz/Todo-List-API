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

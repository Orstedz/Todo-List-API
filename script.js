let todos = [];
let currentPage = 1;
const todosPerPage = 10;
let updatingTodoId = null;

// Fetch Todos from API
async function fetchTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  todos = await response.json();
  renderTodos();
}

// Render Todos
function renderTodos() {
  const todoList = document.getElementById("todo-list");
  const activeTodos = document.getElementById("active-todos");
  const completedTodos = document.getElementById("completed-todos");
  todoList.innerHTML = "";
  activeTodos.innerHTML = "";
  completedTodos.innerHTML = "";

  const start = (currentPage - 1) * todosPerPage;
  const end = start + todosPerPage;
  const paginatedTodos = todos.slice(start, end);

  paginatedTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.className = `list-group-item d-flex align-items-center border-0 mb-2 rounded ${
      todo.completed ? "done" : ""
    }`;
    todoItem.innerHTML = `
      <input class="form-check-input me-2" type="checkbox" ${
        todo.completed ? "checked" : ""
      } onchange="markAsDone(${todo.id})" />
      <span>${todo.title}</span>
      <button class="btn btn-sm btn-danger ms-auto" onclick="deleteTodo(${
        todo.id
      })">Delete</button>
      <button class="btn btn-sm btn-warning ms-2" onclick="showUpdateModal(${
        todo.id
      })">Update</button>
    `;
    todoList.appendChild(todoItem);

    if (!todo.completed) {
      activeTodos.appendChild(todoItem.cloneNode(true));
    } else {
      completedTodos.appendChild(todoItem.cloneNode(true));
    }
  });
}

// Create Todo
async function createTodo() {
  const title = document.getElementById("new-title").value;
  const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    body: JSON.stringify({ title, completed: false }),
    headers: { "Content-Type": "application/json" },
  });
  const newTodo = await response.json();
  todos.unshift(newTodo); // Add to the beginning of the list
  renderTodos();
  document.getElementById("new-title").value = ""; // Clear input
}

// Mark as Done
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

// Delete Todo
async function deleteTodo(todoId) {
  await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
    method: "DELETE",
  });
  todos = todos.filter((t) => t.id !== todoId);
  renderTodos();
}

// Show Update Modal
function showUpdateModal(todoId) {
  updatingTodoId = todoId;
  const modal = document.getElementById("update-modal");
  modal.style.display = "block";
  const todo = todos.find((t) => t.id === todoId);
  document.getElementById("update-title").value = todo.title;
}

// Save Update
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

// Cancel Update
document.getElementById("cancel-update").addEventListener("click", () => {
  document.getElementById("update-modal").style.display = "none";
});

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

// Initialize
fetchTodos();

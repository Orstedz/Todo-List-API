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

  // Get the active tab
  const activeTab = document.querySelector(".nav-link.active").id;

  // Filter todos based on the active tab
  let filteredTodos = [];
  if (activeTab === "ex1-tab-1") {
    // All tab
    filteredTodos = todos;
  } else if (activeTab === "ex1-tab-2") {
    // Active tab
    filteredTodos = todos.filter((todo) => !todo.completed);
  } else if (activeTab === "ex1-tab-3") {
    // Completed tab
    filteredTodos = todos.filter((todo) => todo.completed);
  }

  // Paginate the filtered todos
  const start = (currentPage - 1) * todosPerPage;
  const end = start + todosPerPage;
  const paginatedTodos = filteredTodos.slice(start, end);

  // Render todos
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

    // Add to "All" tab
    todoList.appendChild(todoItem.cloneNode(true));

    // Add to "Active" or "Completed" tab based on checkbox state
    if (!todo.completed) {
      activeTodos.appendChild(todoItem.cloneNode(true));
    } else {
      completedTodos.appendChild(todoItem.cloneNode(true));
    }
  });

  // Update pagination buttons
  updatePaginationButtons(filteredTodos.length);
}

// Create Todo
async function createTodo() {
  const title = document.getElementById("new-title").value;
  if (!title) return; // Prevent empty todos

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
  if (!newTitle) return; // Prevent empty updates

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

// Update Pagination Buttons
function updatePaginationButtons(totalTodos) {
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage * todosPerPage >= totalTodos;
}

// Tab Switching
document.querySelectorAll(".nav-link").forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs
    document
      .querySelectorAll(".nav-link")
      .forEach((t) => t.classList.remove("active"));
    // Add active class to the clicked tab
    tab.classList.add("active");
    // Reset pagination to the first page
    currentPage = 1;
    // Render todos based on the selected tab
    renderTodos();
  });
});

// Initialize
fetchTodos();

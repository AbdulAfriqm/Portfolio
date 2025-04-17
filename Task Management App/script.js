// DOM Elements
const taskBoard = document.getElementById("task-board");
const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const doneList = document.getElementById("done-list");
const todoCount = document.getElementById("todo-count");
const inProgressCount = document.getElementById("in-progress-count");
const doneCount = document.getElementById("done-count");
const addTaskBtn = document.getElementById("add-task-btn");
const taskModal = document.getElementById("task-modal");
const closeModal = document.getElementById("close-modal");
const cancelTask = document.getElementById("cancel-task");
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const taskPriority = document.getElementById("task-priority");
const taskStatus = document.getElementById("task-status");

// Task state
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let draggedTask = null;

// Initialize the app
function init() {
  renderTasks();
  setupEventListeners();
  updateTaskCounts();
}

// Render tasks to the board
function renderTasks() {
  // Clear all lists
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";

  // Render each task
  tasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    switch (task.status) {
      case "todo":
        todoList.appendChild(taskElement);
        break;
      case "in-progress":
        inProgressList.appendChild(taskElement);
        break;
      case "done":
        doneList.appendChild(taskElement);
        break;
    }
  });
}

// Create a task element
function createTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.className = "task-item";
  taskElement.setAttribute("draggable", "true");
  taskElement.dataset.id = task.id;

  // Priority class
  const priorityClass = `priority-${task.priority}`;

  taskElement.innerHTML = `
        <h4 class="task-title">${task.title}</h4>
        <p class="task-description">${task.description}</p>
        <div class="task-footer">
            <span class="task-priority ${priorityClass}">${task.priority}</span>
            <div class="task-actions">
                <button class="task-btn edit-task" data-id="${task.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-btn delete-task" data-id="${task.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;

  return taskElement;
}

// Set up event listeners
function setupEventListeners() {
  // Modal controls
  addTaskBtn.addEventListener("click", () => {
    taskModal.classList.add("active");
  });

  closeModal.addEventListener("click", () => {
    taskModal.classList.remove("active");
  });

  cancelTask.addEventListener("click", () => {
    taskModal.classList.remove("active");
  });

  // Form submission
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
    taskModal.classList.remove("active");
    taskForm.reset();
  });

  // Drag and drop events
  document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("task-item")) {
      draggedTask = e.target;
      e.target.classList.add("dragging");
    }
  });

  document.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("task-item")) {
      e.target.classList.remove("dragging");
    }
  });

  document.addEventListener("dragover", (e) => {
    e.preventDefault();
    const taskList = e.target.closest(".task-list");
    if (taskList) {
      const afterElement = getDragAfterElement(taskList, e.clientY);
      const currentElement = document.querySelector(".dragging");

      if (!afterElement) {
        taskList.appendChild(currentElement);
      } else {
        taskList.insertBefore(currentElement, afterElement);
      }
    }
  });

  document.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedTask) {
      const newStatus = e.target.closest(".task-column").dataset.status;
      const taskId = parseInt(draggedTask.dataset.id);
      updateTaskStatus(taskId, newStatus);
      draggedTask = null;
    }
  });

  // Click events for edit and delete
  document.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("delete-task") ||
      e.target.parentElement.classList.contains("delete-task")
    ) {
      const taskId = parseInt(
        e.target.dataset.id || e.target.parentElement.dataset.id
      );
      deleteTask(taskId);
    }

    if (
      e.target.classList.contains("edit-task") ||
      e.target.parentElement.classList.contains("edit-task")
    ) {
      const taskId = parseInt(
        e.target.dataset.id || e.target.parentElement.dataset.id
      );
      editTask(taskId);
    }
  });
}

// Helper function for drag and drop positioning
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".task-item:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Add a new task
function addTask() {
  const newTask = {
    id: Date.now(),
    title: taskTitle.value,
    description: taskDescription.value,
    priority: taskPriority.value,
    status: taskStatus.value,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  updateTaskCounts();
}

// Update task status
function updateTaskStatus(taskId, newStatus) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].status = newStatus;
    saveTasks();
    renderTasks();
    updateTaskCounts();
  }
}

// Delete a task
function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
  updateTaskCounts();
}

// Edit a task
function editTask(taskId) {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    taskTitle.value = task.title;
    taskDescription.value = task.description;
    taskPriority.value = task.priority;
    taskStatus.value = task.status;

    // Delete the old task
    deleteTask(taskId);

    // Open modal
    taskModal.classList.add("active");
  }
}

// Update task counts
function updateTaskCounts() {
  const todoTasks = tasks.filter((task) => task.status === "todo").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const doneTasks = tasks.filter((task) => task.status === "done").length;

  todoCount.textContent = todoTasks;
  inProgressCount.textContent = inProgressTasks;
  doneCount.textContent = doneTasks;
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initialize the app
init();

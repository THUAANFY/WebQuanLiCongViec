// Task Management Board JavaScript - Enhanced Version

// Initialize tasks from localStorage or use default empty arrays
let tasks = JSON.parse(localStorage.getItem("tasks")) || {
  todo: [],
  inprogress: [],
  done: [],
}

// Initialize archived tasks
let archivedTasks = JSON.parse(localStorage.getItem("archivedTasks")) || []

// Initialize task templates
const taskTemplates = JSON.parse(localStorage.getItem("taskTemplates")) || [
  {
    id: "template-1",
    title: "Báo cáo hàng tuần",
    description: "Tạo báo cáo tổng hợp công việc trong tuần",
    tags: ["work"],
    priority: "medium",
    subtasks: [
      { text: "Thu thập dữ liệu", completed: false },
      { text: "Phân tích kết quả", completed: false },
      { text: "Viết báo cáo", completed: false },
      { text: "Gửi báo cáo cho quản lý", completed: false },
    ],
  },
  {
    id: "template-2",
    title: "Lịch hẹn khám sức khỏe",
    description: "Đặt lịch khám sức khỏe định kỳ",
    tags: ["health", "personal"],
    priority: "high",
    subtasks: [
      { text: "Tìm phòng khám phù hợp", completed: false },
      { text: "Đặt lịch hẹn", completed: false },
      { text: "Chuẩn bị hồ sơ y tế", completed: false },
    ],
  },
  {
    id: "template-3",
    title: "Học khóa học mới",
    description: "Theo dõi tiến độ học tập khóa học mới",
    tags: ["study"],
    priority: "medium",
    subtasks: [
      { text: "Đăng ký khóa học", completed: false },
      { text: "Hoàn thành bài học 1", completed: false },
      { text: "Hoàn thành bài học 2", completed: false },
      { text: "Làm bài kiểm tra", completed: false },
    ],
  },
]

// Track task history for statistics
let taskHistory = JSON.parse(localStorage.getItem("taskHistory")) || []

// Active filters
const activeFilters = {
  priority: [],
  tags: [],
  search: "",
}

// Current view mode
let viewMode = localStorage.getItem("viewMode") || "board"

// DOM Elements
const addTaskBtn = document.getElementById("add-task-btn")
const taskModal = document.getElementById("task-modal")
const closeModal = document.getElementById("close-modal")
const cancelBtn = document.getElementById("cancel-btn")
const taskForm = document.getElementById("task-form")
const taskIdInput = document.getElementById("task-id")
const taskStatusInput = document.getElementById("task-status")
const taskTitleInput = document.getElementById("task-title")
const taskDescriptionInput = document.getElementById("task-description")
const taskPriorityInput = document.getElementById("task-priority")
const taskDueDateInput = document.getElementById("task-due-date")
const taskEstimatedHoursInput = document.getElementById("task-estimated-hours")
const taskEstimatedMinutesInput = document.getElementById("task-estimated-minutes")
const taskNotesInput = document.getElementById("task-notes")
const taskDependenciesSelect = document.getElementById("task-dependencies")
const dependenciesContainer = document.getElementById("dependencies-container")
const modalTitle = document.getElementById("modal-title")
const todoList = document.getElementById("todo-list")
const inprogressList = document.getElementById("inprogress-list")
const doneList = document.getElementById("done-list")
const todoCount = document.getElementById("todo-count")
const inprogressCount = document.getElementById("inprogress-count")
const doneCount = document.getElementById("done-count")
const searchInput = document.getElementById("search-input")
const filterBtn = document.getElementById("filter-btn")
const filterDropdown = document.getElementById("filter-dropdown")
const applyFiltersBtn = document.getElementById("apply-filters")
const clearFiltersBtn = document.getElementById("clear-filters")
const activeFiltersContainer = document.getElementById("active-filters")
const sortBtn = document.getElementById("sort-btn")
const viewBtn = document.getElementById("view-btn")
const toggleDarkMode = document.getElementById("toggle-dark-mode")
const toggleStatsBtn = document.getElementById("toggle-stats-btn")
const statsSection = document.getElementById("stats-section")
const totalTasksElement = document.getElementById("total-tasks")
const todoTasksElement = document.getElementById("todo-tasks")
const inprogressTasksElement = document.getElementById("inprogress-tasks")
const doneTasksElement = document.getElementById("done-tasks")
const todoTasksPercentElement = document.getElementById("todo-tasks-percent")
const inprogressTasksPercentElement = document.getElementById("inprogress-tasks-percent")
const doneTasksPercentElement = document.getElementById("done-tasks-percent")
const totalTasksChangeElement = document.getElementById("total-tasks-change")
const chartBars = document.querySelectorAll(".chart-bar")
const confirmationDialog = document.getElementById("confirmation-dialog")
const confirmationOverlay = document.getElementById("confirmation-overlay")
const confirmationMessage = document.getElementById("confirmation-message")
const cancelConfirmationBtn = document.getElementById("cancel-confirmation")
const confirmActionBtn = document.getElementById("confirm-action")
const toast = document.getElementById("toast")
const toastMessage = document.getElementById("toast-message")
const toastIcon = document.getElementById("toast-icon")
const closeToast = document.getElementById("close-toast")
const subtasksContainer = document.getElementById("subtasks-container")
const newSubtaskInput = document.getElementById("new-subtask")
const addSubtaskBtn = document.getElementById("add-subtask-btn")
const columnAddBtns = document.querySelectorAll(".column-add-btn")
const viewTemplatesBtn = document.getElementById("view-templates-btn")
const templatesModal = document.getElementById("templates-modal")
const closeTemplatesModal = document.getElementById("close-templates-modal")
const templatesContainer = document.getElementById("templates-container")
const templateSearch = document.getElementById("template-search")
const createTemplateBtn = document.getElementById("create-template-btn")
const useTemplateBtn = document.getElementById("use-template-btn")
const viewArchiveBtn = document.getElementById("view-archive-btn")
const archiveModal = document.getElementById("archive-modal")
const closeArchiveModal = document.getElementById("close-archive-modal")
const archiveContainer = document.getElementById("archive-container")
const archiveSearch = document.getElementById("archive-search")
const clearArchiveBtn = document.getElementById("clear-archive-btn")
const tagDistributionBars = {
  work: document.getElementById("work-tag-bar"),
  personal: document.getElementById("personal-tag-bar"),
  study: document.getElementById("study-tag-bar"),
  health: document.getElementById("health-tag-bar"),
  finance: document.getElementById("finance-tag-bar"),
}
const tagCountElements = {
  work: document.getElementById("work-tag-count"),
  personal: document.getElementById("personal-tag-count"),
  study: document.getElementById("study-tag-count"),
  health: document.getElementById("health-tag-count"),
  finance: document.getElementById("finance-tag-count"),
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra và tạo các phần tử overlay nếu chúng không tồn tại
  if (!confirmationOverlay) {
    createConfirmationElements()
  }

  // Add styles for confirmation overlay and dialog
  const style = document.createElement("style")
  style.textContent = `
        #confirmation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        #confirmation-dialog {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          max-width: 400px;
          width: 90%;
          z-index: 1001;
        }
        
        .dark #confirmation-dialog {
          background-color: #1f2937;
          color: white;
        }
        
        .task-card-action.delete {
          background-color: rgba(239, 68, 68, 0.1);
          color: rgb(239, 68, 68);
        }
        
        .task-card:hover .task-card-actions {
          opacity: 1 !important;
        }
        
        .group:hover .task-card-actions {
          opacity: 1 !important;
        }
  
        .confirmation-buttons {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
          gap: 10px;
        }
  
        .confirmation-buttons button {
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }
  
        #cancel-confirmation {
          background-color: #e5e7eb;
          color: #374151;
        }
  
        #cancel-confirmation:hover {
          background-color: #d1d5db;
        }
  
        #confirm-action {
          background-color: #ef4444;
          color: white;
        }
  
        #confirm-action:hover {
          background-color: #dc2626;
        }
  
        .dark #cancel-confirmation {
          background-color: #374151;
          color: #e5e7eb;
        }
  
        .dark #cancel-confirmation:hover {
          background-color: #4b5563;
        }
      `
  document.head.appendChild(style)

  // Add event listeners after DOM is fully loaded
  addTaskBtn.addEventListener("click", () => openAddTaskModal("todo"))
  closeModal.addEventListener("click", closeTaskModal)
  cancelBtn.addEventListener("click", closeTaskModal)
  taskForm.addEventListener("submit", saveTask)
  searchInput.addEventListener("input", handleSearch)
  filterBtn.addEventListener("click", toggleFilterDropdown)
  applyFiltersBtn.addEventListener("click", applyFilters)
  clearFiltersBtn.addEventListener("click", clearFilters)
  sortBtn.addEventListener("click", toggleSortOptions)
  viewBtn.addEventListener("click", toggleViewOptions)
  toggleDarkMode.addEventListener("click", toggleDarkModeHandler)
  toggleStatsBtn.addEventListener("click", toggleStats)

  // Kiểm tra xem các phần tử có tồn tại không trước khi thêm event listener
  if (cancelConfirmationBtn) {
    cancelConfirmationBtn.addEventListener("click", closeConfirmationDialog)
  }

  closeToast.addEventListener("click", hideToast)
  addSubtaskBtn.addEventListener("click", addSubtask)
  viewTemplatesBtn.addEventListener("click", openTemplatesModal)
  closeTemplatesModal.addEventListener("click", closeTemplatesModalFunc)
  templateSearch.addEventListener("input", filterTemplates)
  createTemplateBtn.addEventListener("click", createTemplate)
  useTemplateBtn.addEventListener("click", useSelectedTemplate)
  viewArchiveBtn.addEventListener("click", openArchiveModal)
  closeArchiveModal.addEventListener("click", closeArchiveModalFunc)
  archiveSearch.addEventListener("input", filterArchivedTasks)
  clearArchiveBtn.addEventListener("click", confirmClearArchive)
  newSubtaskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSubtask()
    }
  })

  columnAddBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const status = btn.dataset.status
      openAddTaskModal(status)
    })
  })

  // Check if dark mode is enabled in localStorage
  if (
    localStorage.getItem("darkMode") === "true" ||
    (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches &&
      localStorage.getItem("darkMode") === null)
  ) {
    document.documentElement.classList.add("dark")
  }

  // Initialize the board
  initializeBoard()
  updateStatistics()
  populateTaskDependenciesSelect()

  // Kiểm tra xem có dữ liệu trong localStorage không
  if (!localStorage.getItem("tasks")) {
    // Nếu không có, tạo một số công việc mẫu
    tasks = {
      todo: [
        {
          id: "task-1",
          status: "todo",
          title: "Hoàn thành báo cáo dự án",
          description: "Tổng hợp dữ liệu và viết báo cáo tổng kết dự án quý 2",
          priority: "high",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          tags: ["work"],
          subtasks: [
            { text: "Thu thập dữ liệu", completed: true },
            { text: "Phân tích kết quả", completed: false },
            { text: "Viết báo cáo", completed: false },
          ],
          estimatedTime: 180,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "task-2",
          status: "todo",
          title: "Đặt lịch khám sức khỏe",
          description: "Đặt lịch khám sức khỏe định kỳ tại bệnh viện",
          priority: "medium",
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          tags: ["health", "personal"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      inprogress: [
        {
          id: "task-3",
          status: "inprogress",
          title: "Học khóa học JavaScript nâng cao",
          description: "Hoàn thành các bài học và bài tập trong khóa học",
          priority: "medium",
          tags: ["study"],
          subtasks: [
            { text: "Bài 1: Giới thiệu", completed: true },
            { text: "Bài 2: Biến và kiểu dữ liệu", completed: true },
            { text: "Bài 3: Hàm và đối tượng", completed: false },
            { text: "Bài 4: DOM và sự kiện", completed: false },
          ],
          estimatedTime: 600,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      done: [
        {
          id: "task-4",
          status: "done",
          title: "Thanh toán hóa đơn điện nước",
          description: "Thanh toán hóa đơn điện nước tháng này",
          priority: "high",
          tags: ["finance", "personal"],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }

    // Lưu vào localStorage
    saveTasksToLocalStorage()

    // Thêm vào lịch sử công việc
    taskHistory = [
      {
        id: "task-1",
        status: "todo",
        date: new Date().toISOString(),
      },
      {
        id: "task-2",
        status: "todo",
        date: new Date().toISOString(),
      },
      {
        id: "task-3",
        status: "inprogress",
        date: new Date().toISOString(),
      },
      {
        id: "task-4",
        status: "done",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    localStorage.setItem("taskHistory", JSON.stringify(taskHistory))

    // Refresh the board after adding sample data
    initializeBoard()
    updateStatistics()
  }
})

// Hàm tạo các phần tử xác nhận nếu chúng không tồn tại
function createConfirmationElements() {
  // Tạo overlay
  const overlay = document.createElement("div")
  overlay.id = "confirmation-overlay"
  overlay.className = "hidden"

  // Tạo dialog
  const dialog = document.createElement("div")
  dialog.id = "confirmation-dialog"
  dialog.className = "hidden"

  // Tạo nội dung dialog
  const message = document.createElement("p")
  message.id = "confirmation-message"
  message.className = "text-gray-700 dark:text-gray-300"
  message.textContent = "Bạn có chắc chắn muốn thực hiện hành động này?"

  // Tạo container cho các nút
  const buttonsContainer = document.createElement("div")
  buttonsContainer.className = "confirmation-buttons"

  // Tạo nút hủy
  const cancelBtn = document.createElement("button")
  cancelBtn.id = "cancel-confirmation"
  cancelBtn.textContent = "Hủy"
  cancelBtn.addEventListener("click", closeConfirmationDialog)

  // Tạo nút xác nhận
  const confirmBtn = document.createElement("button")
  confirmBtn.id = "confirm-action"
  confirmBtn.textContent = "Xác nhận"

  // Thêm các nút vào container
  buttonsContainer.appendChild(cancelBtn)
  buttonsContainer.appendChild(confirmBtn)

  // Thêm message và buttons vào dialog
  dialog.appendChild(message)
  dialog.appendChild(buttonsContainer)

  // Thêm dialog vào overlay
  overlay.appendChild(dialog)

  // Thêm overlay vào body
  document.body.appendChild(overlay)

  // Cập nhật các biến toàn cục
  const confirmationOverlay = overlay
  const confirmationDialog = dialog
  const confirmationMessage = message
  const cancelConfirmationBtn = cancelBtn
  const confirmActionBtn = confirmBtn
}

// Functions
function initializeBoard() {
  // Clear all lists
  todoList.innerHTML = ""
  inprogressList.innerHTML = ""
  doneList.innerHTML = ""

  // Get all tasks across all statuses
  const allTasks = [...tasks.todo, ...tasks.inprogress, ...tasks.done]

  // Apply filters if any
  const filteredTasks = filterTasks(allTasks)

  // Separate filtered tasks by status
  const filteredTasksByStatus = {
    todo: filteredTasks.filter((task) => task.status === "todo"),
    inprogress: filteredTasks.filter((task) => task.status === "inprogress"),
    done: filteredTasks.filter((task) => task.status === "done"),
  }

  // Render tasks in each column
  renderTasks("todo", filteredTasksByStatus.todo, todoList)
  renderTasks("inprogress", filteredTasksByStatus.inprogress, inprogressList)
  renderTasks("done", filteredTasksByStatus.done, doneList)

  // Update counters
  updateCounters(filteredTasksByStatus)

  // Setup drag and drop
  setupDragAndDrop()
}

function filterTasks(taskList) {
  return taskList.filter((task) => {
    // Filter by search term
    const searchMatch =
      !activeFilters.search ||
      task.title.toLowerCase().includes(activeFilters.search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(activeFilters.search.toLowerCase()))

    // Filter by priority
    const priorityMatch = activeFilters.priority.length === 0 || activeFilters.priority.includes(task.priority)

    // Filter by tags
    const tagMatch =
      activeFilters.tags.length === 0 || (task.tags && task.tags.some((tag) => activeFilters.tags.includes(tag)))

    return searchMatch && priorityMatch && tagMatch
  })
}

function renderTasks(status, taskList, container) {
  if (taskList.length === 0) {
    const emptyState = document.createElement("div")
    emptyState.className = "flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400"
    emptyState.innerHTML = `
                <i class="fas fa-clipboard-list text-3xl mb-2"></i>
                <p>Không có công việc nào</p>
                <button class="mt-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm add-task-empty" data-status="${status}">
                    <i class="fas fa-plus mr-1"></i> Thêm công việc
                </button>
            `
    container.appendChild(emptyState)

    // Add event listener to the add task button
    emptyState.querySelector(".add-task-empty").addEventListener("click", (e) => {
      openAddTaskModal(e.target.dataset.status || status)
    })

    return
  }

  taskList.forEach((task) => {
    const taskCard = createTaskCard(task)
    container.appendChild(taskCard)
  })
}

function createTaskCard(task) {
  const taskCard = document.createElement("div")
  taskCard.className = `task-card bg-white dark:bg-gray-800 p-4 rounded-lg shadow-card hover:shadow-card-hover mb-3 priority-${task.priority} relative group`
  taskCard.draggable = true
  taskCard.dataset.id = task.id
  taskCard.dataset.status = task.status

  const priorityLabel = task.priority === "high" ? "Cao" : task.priority === "medium" ? "Trung bình" : "Thấp"
  const priorityColor =
    task.priority === "high"
      ? "bg-danger-100 dark:bg-danger-900 text-danger-800 dark:text-danger-200"
      : task.priority === "medium"
        ? "bg-warning-100 dark:bg-warning-900 text-warning-800 dark:text-warning-200"
        : "bg-info-100 dark:bg-info-900 text-info-800 dark:text-info-200"

  // Calculate subtask progress if any
  let subtaskProgress = 0
  let completedSubtasks = 0
  if (task.subtasks && task.subtasks.length > 0) {
    completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length
    subtaskProgress = Math.round((completedSubtasks / task.subtasks.length) * 100)
  }

  // Format due date and determine status
  let dueDateHTML = ""
  if (task.dueDate) {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const dueDateFormatted = dueDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })

    let dueDateClass = "text-info-600 dark:text-info-400"
    let dueDateIcon = "far fa-calendar-alt"
    let dueDateStatus = ""

    if (dueDate < today) {
      dueDateClass = "text-danger-600 dark:text-danger-400"
      dueDateIcon = "fas fa-exclamation-circle"
      dueDateStatus = " (Quá hạn)"
    } else if (dueDate.getTime() === today.getTime()) {
      dueDateClass = "text-warning-600 dark:text-warning-400"
      dueDateIcon = "fas fa-clock"
      dueDateStatus = " (Hôm nay)"
    }

    dueDateHTML = `
                <div class="flex items-center ${dueDateClass} text-xs mt-2">
                    <i class="${dueDateIcon} mr-1"></i>
                    <span>${dueDateFormatted}${dueDateStatus}</span>
                </div>
            `
  }

  // Format tags
  let tagsHTML = ""
  if (task.tags && task.tags.length > 0) {
    tagsHTML = '<div class="flex flex-wrap gap-1 mt-2">'
    const tagColors = {
      work: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      personal: "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200",
      study: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      health: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
      finance: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
    }

    task.tags.forEach((tag) => {
      const tagClass = tagColors[tag] || "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      const tagLabel =
        tag === "work"
          ? "Công việc"
          : tag === "personal"
            ? "Cá nhân"
            : tag === "study"
              ? "Học tập"
              : tag === "health"
                ? "Sức khỏe"
                : "Tài chính"
      tagsHTML += `<span class="px-2 py-1 rounded-full text-xs ${tagClass}">${tagLabel}</span>`
    })
    tagsHTML += "</div>"
  }

  // Subtasks preview
  let subtasksHTML = ""
  if (task.subtasks && task.subtasks.length > 0) {
    subtasksHTML = `
                <div class="mt-3">
                    <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Tiến độ công việc con</span>
                        <span>${completedSubtasks}/${task.subtasks.length}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill bg-primary-500" style="width: ${subtaskProgress}%"></div>
                    </div>
                </div>
            `
  }

  // Time tracking
  let timeTrackingHTML = ""
  if (task.estimatedTime) {
    timeTrackingHTML = `
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <i class="far fa-clock mr-1"></i>
                    <span>Dự kiến: ${formatTime(task.estimatedTime)}</span>
                </div>
            `
  }

  // Notes preview
  let notesHTML = ""
  if (task.notes) {
    notesHTML = `
                <div class="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300 italic">
                    ${task.notes.length > 100 ? task.notes.substring(0, 100) + "..." : task.notes}
                </div>
            `
  }

  // Dependencies
  let dependenciesHTML = ""
  if (task.dependencies && task.dependencies.length > 0) {
    dependenciesHTML = `
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <i class="fas fa-link mr-1"></i>
                    <span>Phụ thuộc: ${task.dependencies.length} công việc</span>
                </div>
            `
  }

  taskCard.innerHTML = `
            <div class="task-card-actions absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="task-card-action edit w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900" data-id="${task.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-card-action archive w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600" data-id="${task.id}">
                    <i class="fas fa-archive"></i>
                </button>
                <button class="task-card-action delete w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900" data-id="${task.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-gray-800 dark:text-white pr-16">${task.title}</h3>
                <span class="${priorityColor} text-xs px-2 py-1 rounded-full">${priorityLabel}</span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-sm">${task.description || "Không có mô tả"}</p>
            ${subtasksHTML}
            ${tagsHTML}
            ${dueDateHTML}
            ${timeTrackingHTML}
            ${dependenciesHTML}
            ${notesHTML}
            <div class="flex justify-between items-center mt-3">
                <span class="text-xs text-gray-500 dark:text-gray-400">${formatDate(task.createdAt)}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">ID: ${task.id.substring(0, 8)}</span>
            </div>
        `

  // Add event listeners for edit, archive and delete buttons
  taskCard.querySelector(".task-card-action.edit").addEventListener("click", (e) => {
    e.stopPropagation()
    openEditTaskModal(task.id)
  })

  taskCard.querySelector(".task-card-action.archive").addEventListener("click", (e) => {
    e.stopPropagation()
    confirmArchiveTask(task.id)
  })

  taskCard.querySelector(".task-card-action.delete").addEventListener("click", (e) => {
    e.stopPropagation()
    confirmDeleteTask(task.id)
  })

  // Add drag events
  taskCard.addEventListener("dragstart", handleDragStart)

  // Add click event to open task details
  taskCard.addEventListener("click", () => {
    openTaskDetails(task.id)
  })

  return taskCard
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

function openAddTaskModal(status = "todo") {
  modalTitle.textContent = "Thêm công việc mới"
  taskIdInput.value = ""
  taskStatusInput.value = status
  taskTitleInput.value = ""
  taskDescriptionInput.value = ""
  taskPriorityInput.value = "medium"
  taskDueDateInput.value = ""
  taskEstimatedHoursInput.value = ""
  taskEstimatedMinutesInput.value = ""
  taskNotesInput.value = ""

  // Clear subtasks
  subtasksContainer.innerHTML = ""
  newSubtaskInput.value = ""

  // Clear tag checkboxes
  document.querySelectorAll(".tag-checkbox").forEach((checkbox) => {
    checkbox.checked = false
  })

  // Clear dependencies
  dependenciesContainer.innerHTML = ""
  populateTaskDependenciesSelect()

  taskModal.classList.add("show")
  taskModal.classList.remove("hidden")

  // Focus on title input
  setTimeout(() => {
    taskTitleInput.focus()
  }, 100)
}

function openEditTaskModal(taskId) {
  modalTitle.textContent = "Chỉnh sửa công việc"

  // Find the task
  let taskToEdit = null
  for (const status in tasks) {
    const task = tasks[status].find((t) => t.id === taskId)
    if (task) {
      taskToEdit = task
      break
    }
  }

  if (taskToEdit) {
    taskIdInput.value = taskToEdit.id
    taskStatusInput.value = taskToEdit.status
    taskTitleInput.value = taskToEdit.title
    taskDescriptionInput.value = taskToEdit.description || ""
    taskPriorityInput.value = taskToEdit.priority
    taskDueDateInput.value = taskToEdit.dueDate || ""
    taskNotesInput.value = taskToEdit.notes || ""

    // Set estimated time
    if (taskToEdit.estimatedTime) {
      const hours = Math.floor(taskToEdit.estimatedTime / 60)
      const minutes = taskToEdit.estimatedTime % 60
      taskEstimatedHoursInput.value = hours
      taskEstimatedMinutesInput.value = minutes
    } else {
      taskEstimatedHoursInput.value = ""
      taskEstimatedMinutesInput.value = ""
    }

    // Set tag checkboxes
    document.querySelectorAll(".tag-checkbox").forEach((checkbox) => {
      checkbox.checked = taskToEdit.tags && taskToEdit.tags.includes(checkbox.value)
    })

    // Render subtasks
    subtasksContainer.innerHTML = ""
    if (taskToEdit.subtasks && taskToEdit.subtasks.length > 0) {
      taskToEdit.subtasks.forEach((subtask, index) => {
        addSubtaskToForm(subtask.text, subtask.completed, index)
      })
    }

    // Render dependencies
    dependenciesContainer.innerHTML = ""
    populateTaskDependenciesSelect(taskToEdit.id)
    if (taskToEdit.dependencies && taskToEdit.dependencies.length > 0) {
      taskToEdit.dependencies.forEach((depId) => {
        const depTask = findTaskById(depId)
        if (depTask) {
          addDependencyToForm(depTask)
        }
      })
    }

    taskModal.classList.add("show")
    taskModal.classList.remove("hidden")

    // Focus on title input
    setTimeout(() => {
      taskTitleInput.focus()
    }, 100)
  }
}

function openTaskDetails(taskId) {
  // This function would open a detailed view of the task
  // For now, we'll just open the edit modal
  openEditTaskModal(taskId)
}

function closeTaskModal() {
  taskModal.classList.remove("show")
  setTimeout(() => {
    taskModal.classList.add("hidden")
  }, 300)
}

function addSubtask() {
  const subtaskText = newSubtaskInput.value.trim()
  if (subtaskText) {
    const subtaskIndex = document.querySelectorAll(".subtask-item").length
    addSubtaskToForm(subtaskText, false, subtaskIndex)
    newSubtaskInput.value = ""
    newSubtaskInput.focus()
  }
}

function addSubtaskToForm(text, completed, index) {
  const subtaskItem = document.createElement("div")
  subtaskItem.className = "subtask-item flex items-center bg-gray-50 dark:bg-gray-700 p-2 rounded"
  subtaskItem.innerHTML = `
            <div class="custom-checkbox ${completed ? "checked" : ""}" data-index="${index}"></div>
            <span class="subtask-text ml-2 text-gray-700 dark:text-gray-300 ${completed ? "line-through text-gray-400 dark:text-gray-500" : ""}">${text}</span>
            <input type="hidden" name="subtask-text-${index}" value="${text}">
            <input type="hidden" name="subtask-completed-${index}" value="${completed}">
            <button type="button" class="ml-auto text-danger-500 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 remove-subtask" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `
  subtasksContainer.appendChild(subtaskItem)

  // Add event listeners
  const checkbox = subtaskItem.querySelector(".custom-checkbox")
  checkbox.addEventListener("click", () => {
    checkbox.classList.toggle("checked")
    const textElement = subtaskItem.querySelector(".subtask-text")
    textElement.classList.toggle("line-through")
    textElement.classList.toggle("text-gray-400")
    textElement.classList.toggle("dark:text-gray-500")
    const completedInput = subtaskItem.querySelector(`input[name="subtask-completed-${index}"]`)
    completedInput.value = checkbox.classList.contains("checked")
  })

  const removeBtn = subtaskItem.querySelector(".remove-subtask")
  removeBtn.addEventListener("click", () => {
    subtaskItem.remove()
    // Reindex remaining subtasks
    reindexSubtasks()
  })
}

function reindexSubtasks() {
  const subtaskItems = subtasksContainer.querySelectorAll(".subtask-item")
  subtaskItems.forEach((item, index) => {
    const checkbox = item.querySelector(".custom-checkbox")
    const removeBtn = item.querySelector(".remove-subtask")
    const textInput = item.querySelector('input[name^="subtask-text-"]')
    const completedInput = item.querySelector('input[name^="subtask-completed-"]')

    checkbox.dataset.index = index

    removeBtn.dataset.index = index
    textInput.name = `subtask-text-${index}`
    completedInput.name = `subtask-completed-${index}`
  })
}

function populateTaskDependenciesSelect(excludeTaskId = null) {
  // Clear existing options except the default one
  while (taskDependenciesSelect.options.length > 1) {
    taskDependenciesSelect.remove(1)
  }

  // Get all tasks
  const allTasks = [...tasks.todo, ...tasks.inprogress, ...tasks.done]

  // Filter out the current task if editing
  const availableTasks = allTasks.filter((task) => task.id !== excludeTaskId)

  // Add options for each task
  availableTasks.forEach((task) => {
    const option = document.createElement("option")
    option.value = task.id
    option.textContent = task.title
    taskDependenciesSelect.appendChild(option)
  })

  // Add event listener to add dependency
  taskDependenciesSelect.onchange = function () {
    if (this.value) {
      const selectedTask = findTaskById(this.value)
      if (selectedTask) {
        addDependencyToForm(selectedTask)
        this.value = "" // Reset select
      }
    }
  }
}

function addDependencyToForm(task) {
  // Check if dependency already exists
  const existingDep = dependenciesContainer.querySelector(`[data-dependency-id="${task.id}"]`)
  if (existingDep) return

  const dependencyItem = document.createElement("div")
  dependencyItem.className = "dependency-item"
  dependencyItem.dataset.dependencyId = task.id

  const statusClass = task.status === "done" ? "completed" : "pending"

  dependencyItem.innerHTML = `
            <div class="dependency-status ${statusClass}"></div>
            <div class="dependency-title">${task.title}</div>
            <input type="hidden" name="dependency-id" value="${task.id}">
            <button type="button" class="dependency-remove">
                <i class="fas fa-times"></i>
            </button>
        `

  dependenciesContainer.appendChild(dependencyItem)

  // Add event listener to remove button
  dependencyItem.querySelector(".dependency-remove").addEventListener("click", () => {
    dependencyItem.remove()
  })
}

function saveTask(e) {
  e.preventDefault()

  const id = taskIdInput.value || Date.now().toString()
  const status = taskStatusInput.value
  const title = taskTitleInput.value
  const description = taskDescriptionInput.value
  const priority = taskPriorityInput.value
  const dueDate = taskDueDateInput.value
  const notes = taskNotesInput.value

  // Calculate estimated time in minutes
  let estimatedTime = null
  const hours = Number.parseInt(taskEstimatedHoursInput.value) || 0
  const minutes = Number.parseInt(taskEstimatedMinutesInput.value) || 0
  if (hours > 0 || minutes > 0) {
    estimatedTime = hours * 60 + minutes
  }

  // Get selected tags
  const tags = []
  document.querySelectorAll(".tag-checkbox:checked").forEach((checkbox) => {
    tags.push(checkbox.value)
  })

  // Get subtasks
  const subtasks = []
  const subtaskItems = subtasksContainer.querySelectorAll(".subtask-item")
  subtaskItems.forEach((item, index) => {
    const textInput = item.querySelector(`input[name="subtask-text-${index}"]`)
    const completedInput = item.querySelector(`input[name="subtask-completed-${index}"]`)

    if (textInput && completedInput) {
      subtasks.push({
        text: textInput.value,
        completed: completedInput.value === "true",
      })
    }
  })

  // Get dependencies
  const dependencies = []
  const dependencyItems = dependenciesContainer.querySelectorAll(".dependency-item")
  dependencyItems.forEach((item) => {
    const depId = item.querySelector('input[name="dependency-id"]').value
    dependencies.push(depId)
  })

  const task = {
    id,
    status,
    title,
    description,
    priority,
    dueDate,
    tags,
    subtasks,
    dependencies,
    estimatedTime,
    notes,
    createdAt: taskIdInput.value ? findTaskById(id)?.createdAt || new Date().toISOString() : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // If editing, remove the old task
  if (taskIdInput.value) {
    for (const status in tasks) {
      tasks[status] = tasks[status].filter((t) => t.id !== id)
    }

    // Show toast notification
    showToast("success", "Công việc đã được cập nhật thành công!")
  } else {
    // Add to task history for new tasks
    taskHistory.push({
      id: task.id,
      status: task.status,
      date: new Date().toISOString(),
    })

    // Save task history
    localStorage.setItem("taskHistory", JSON.stringify(taskHistory))

    // Show toast notification
    showToast("success", "Công việc mới đã được tạo thành công!")

    // Show confetti for new task
    createConfetti()
  }

  // Add the task to the appropriate array
  tasks[status].push(task)

  // Save to localStorage
  saveTasksToLocalStorage()

  // Close modal and refresh board
  closeTaskModal()
  initializeBoard()
  updateStatistics()
  populateTaskDependenciesSelect()
}

function findTaskById(id) {
  for (const status in tasks) {
    const task = tasks[status].find((t) => t.id === id)
    if (task) return task
  }
  return null
}

function confirmDeleteTask(taskId) {
  // Find the task to get its name
  const taskToDelete = findTaskById(taskId)
  if (taskToDelete) {
    confirmationMessage.textContent = `Bạn có chắc chắn muốn xóa công việc "${taskToDelete.title}"?`
  } else {
    confirmationMessage.textContent = "Bạn có chắc chắn muốn xóa công việc này?"
  }

  // Set up the confirm action
  confirmActionBtn.onclick = () => {
    deleteTask(taskId)
    closeConfirmationDialog()
  }

  // Show confirmation dialog
  confirmationOverlay.classList.remove("hidden")
  confirmationDialog.classList.remove("hidden")

  // Make sure the overlay is visible and positioned correctly
  confirmationOverlay.style.display = "flex"
  confirmationDialog.style.display = "block"
  confirmationDialog.style.zIndex = "1001"
  confirmationOverlay.style.zIndex = "1000"
}

function confirmArchiveTask(taskId) {
  confirmationMessage.textContent = "Bạn có chắc chắn muốn lưu trữ công việc này?"

  // Set up the confirm action
  confirmActionBtn.onclick = () => {
    archiveTask(taskId)
    closeConfirmationDialog()
  }

  // Show confirmation dialog
  confirmationOverlay.classList.remove("hidden")
  confirmationDialog.classList.remove("hidden")

  // Make sure the overlay is visible and positioned correctly
  confirmationOverlay.style.display = "flex"
  confirmationDialog.style.display = "block"
  confirmationDialog.style.zIndex = "1001"
  confirmationOverlay.style.zIndex = "1000"
}

function confirmClearArchive() {
  confirmationMessage.textContent = "Bạn có chắc chắn muốn xóa tất cả công việc đã lưu trữ?"

  // Set up the confirm action
  confirmActionBtn.onclick = () => {
    clearArchive()
    closeConfirmationDialog()
  }

  // Show confirmation dialog
  confirmationOverlay.classList.remove("hidden")
  confirmationDialog.classList.remove("hidden")

  // Make sure the overlay is visible and positioned correctly
  confirmationOverlay.style.display = "flex"
  confirmationDialog.style.display = "block"
  confirmationDialog.style.zIndex = "1001"
  confirmationOverlay.style.zIndex = "1000"
}

function closeConfirmationDialog() {
  confirmationOverlay.classList.add("hidden")
  confirmationDialog.classList.add("hidden")
  confirmationOverlay.style.display = "none"
  confirmationDialog.style.display = "none"
}

function deleteTask(taskId) {
  let taskDeleted = false
  let taskName = ""

  for (const status in tasks) {
    const taskIndex = tasks[status].findIndex((task) => task.id === taskId)
    if (taskIndex !== -1) {
      // Store task name for notification
      taskName = tasks[status][taskIndex].title
      // Remove task
      tasks[status].splice(taskIndex, 1)
      taskDeleted = true
    }
  }

  if (taskDeleted) {
    // Save to localStorage
    saveTasksToLocalStorage()

    // Show toast notification
    showToast("info", `Công việc "${taskName}" đã được xóa thành công!`)

    // Refresh board
    initializeBoard()
    updateStatistics()
    populateTaskDependenciesSelect()
  }
}

function archiveTask(taskId) {
  let taskArchived = false
  let archivedTask = null

  for (const status in tasks) {
    const taskIndex = tasks[status].findIndex((task) => task.id === taskId)
    if (taskIndex !== -1) {
      archivedTask = tasks[status][taskIndex]
      tasks[status].splice(taskIndex, 1)
      taskArchived = true
      break
    }
  }

  if (taskArchived && archivedTask) {
    // Add to archived tasks
    archivedTasks.push({
      ...archivedTask,
      archivedAt: new Date().toISOString(),
    })

    // Save to localStorage
    saveTasksToLocalStorage()
    localStorage.setItem("archivedTasks", JSON.stringify(archivedTasks))

    // Show toast notification
    showToast("info", "Công việc đã được lưu trữ thành công!")

    // Refresh board
    initializeBoard()
    updateStatistics()
    populateTaskDependenciesSelect()
  }
}

function clearArchive() {
  archivedTasks = []
  localStorage.setItem("archivedTasks", JSON.stringify(archivedTasks))

  // Show toast notification
  showToast("info", "Đã xóa tất cả công việc đã lưu trữ!")

  // Refresh archive modal
  renderArchivedTasks()
}

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

function updateCounters(filteredTasks) {
  todoCount.textContent = filteredTasks.todo.length
  inprogressCount.textContent = filteredTasks.inprogress.length
  doneCount.textContent = filteredTasks.done.length
}

function handleSearch() {
  activeFilters.search = searchInput.value.trim()
  initializeBoard()
  updateActiveFiltersDisplay()
}

// In the toggleFilterDropdown function, replace it with this improved version
function toggleFilterDropdown() {
  // If dropdown is already showing, just hide it
  if (filterDropdown.classList.contains("show")) {
    filterDropdown.classList.remove("show")
    // Remove overlay if it exists
    const existingOverlay = document.getElementById("dropdown-overlay")
    if (existingOverlay) {
      existingOverlay.remove()
    }
    return
  }

  // Close other dropdowns first
  document.querySelectorAll(".dropdown-menu").forEach((dropdown) => {
    if (dropdown !== filterDropdown && dropdown.classList.contains("show")) {
      dropdown.classList.remove("show")
    }
  })

  // Check if we're on a mobile screen
  const isMobile = window.innerWidth < 768

  if (isMobile) {
    // Create a backdrop overlay for mobile
    const overlay = document.createElement("div")
    overlay.id = "dropdown-overlay"
    overlay.className = "fixed inset-0 bg-black bg-opacity-50 z-40"
    document.body.appendChild(overlay)

    // Position the dropdown for mobile view
    filterDropdown.style.position = "fixed"
    filterDropdown.style.top = "50%"
    filterDropdown.style.left = "50%"
    filterDropdown.style.transform = "translate(-50%, -50%)"
    filterDropdown.style.width = "85%"
    filterDropdown.style.maxWidth = "350px"
    filterDropdown.style.maxHeight = "80vh"
    filterDropdown.style.overflowY = "auto"
    filterDropdown.style.zIndex = "50"
    filterDropdown.style.borderRadius = "12px"
    filterDropdown.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.2)"
    filterDropdown.style.padding = "16px"

    // Add mobile-specific styling
    filterDropdown.classList.add("mobile-dropdown")

    // Add click event to close when clicking outside
    overlay.addEventListener("click", () => {
      filterDropdown.classList.remove("show")
      overlay.remove()
    })
  } else {
    // Reset styles for desktop
    filterDropdown.style.position = "absolute"
    filterDropdown.style.top = "100%"
    filterDropdown.style.left = "auto"
    filterDropdown.style.right = "0"
    filterDropdown.style.transform = "none"
    filterDropdown.style.width = "250px"
    filterDropdown.style.maxHeight = "none"
    filterDropdown.style.borderRadius = "0.75rem"
    filterDropdown.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    filterDropdown.style.padding = "1rem"

    // Remove mobile-specific styling
    filterDropdown.classList.remove("mobile-dropdown")
  }

  // Show the dropdown
  filterDropdown.classList.add("show")
}

// Update the applyFilters function to handle the overlay
function applyFilters() {
  // Get priority filters
  activeFilters.priority = []
  document.querySelectorAll("#filter-dropdown [data-priority]:checked").forEach((checkbox) => {
    activeFilters.priority.push(checkbox.dataset.priority)
  })

  // Get tag filters
  activeFilters.tags = []
  document.querySelectorAll("#filter-dropdown [data-tag]:checked").forEach((checkbox) => {
    activeFilters.tags.push(checkbox.dataset.tag)
  })

  // Close dropdown and update board
  filterDropdown.classList.remove("show")

  // Remove overlay if it exists
  const existingOverlay = document.getElementById("dropdown-overlay")
  if (existingOverlay) {
    existingOverlay.remove()
  }

  initializeBoard()
  updateActiveFiltersDisplay()
}

// Update the clearFilters function to handle the overlay
function clearFilters() {
  // Clear all checkboxes
  document.querySelectorAll('#filter-dropdown input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false
  })

  // Clear active filters
  activeFilters.priority = []
  activeFilters.tags = []

  // Close dropdown and update board
  filterDropdown.classList.remove("show")

  // Remove overlay if it exists
  const existingOverlay = document.getElementById("dropdown-overlay")
  if (existingOverlay) {
    existingOverlay.remove()
  }

  initializeBoard()
  updateActiveFiltersDisplay()
}

function updateActiveFiltersDisplay() {
  const activeFiltersDiv = document.getElementById("active-filters")
  const filtersContainer = activeFiltersDiv.querySelector(".flex")
  filtersContainer.innerHTML = ""

  let hasActiveFilters = false

  // Add search filter chip
  if (activeFilters.search) {
    const searchChip = document.createElement("div")
    searchChip.className =
      "px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center"
    searchChip.innerHTML = `
                <span>Tìm kiếm: ${activeFilters.search}</span>
                <button class="ml-2 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300" data-filter-type="search">
                    <i class="fas fa-times"></i>
                </button>
            `
    filtersContainer.appendChild(searchChip)
    hasActiveFilters = true

    // Add event listener to remove search filter
    searchChip.querySelector("button").addEventListener("click", () => {
      activeFilters.search = ""
      searchInput.value = ""
      initializeBoard()
      updateActiveFiltersDisplay()
    })
  }

  // Add priority filter chips
  activeFilters.priority.forEach((priority) => {
    const priorityLabel = priority === "high" ? "Cao" : priority === "medium" ? "Trung bình" : "Thấp"
    const priorityChip = document.createElement("div")
    priorityChip.className =
      "px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center"
    priorityChip.innerHTML = `
                <span>Ưu tiên: ${priorityLabel}</span>
                <button class="ml-2 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300" data-filter-type="priority" data-filter-value="${priority}">
                    <i class="fas fa-times"></i>
                </button>
            `
    filtersContainer.appendChild(priorityChip)
    hasActiveFilters = true

    // Add event listener to remove priority filter
    priorityChip.querySelector("button").addEventListener("click", () => {
      activeFilters.priority = activeFilters.priority.filter((p) => p !== priority)
      document.querySelector(`#filter-${priority}`).checked = false
      initializeBoard()
      updateActiveFiltersDisplay()
    })
  })

  // Add tag filter chips
  activeFilters.tags.forEach((tag) => {
    const tagLabel =
      tag === "work"
        ? "Công việc"
        : tag === "personal"
          ? "Cá nhân"
          : tag === "study"
            ? "Học tập"
            : tag === "health"
              ? "Sức khỏe"
              : "Tài chính"
    const tagChip = document.createElement("div")
    tagChip.className =
      "px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center"
    tagChip.innerHTML = `
                <span>Nhãn: ${tagLabel}</span>
                <button class="ml-2 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300" data-filter-type="tag" data-filter-value="${tag}">
                    <i class="fas fa-times"></i>
                </button>
            `
    filtersContainer.appendChild(tagChip)
    hasActiveFilters = true

    // Add event listener to remove tag filter
    tagChip.querySelector("button").addEventListener("click", () => {
      activeFilters.tags = activeFilters.tags.filter((t) => t !== tag)
      document.querySelector(`#filter-${tag}`).checked = false
      initializeBoard()
      updateActiveFiltersDisplay()
    })
  })

  // Show or hide active filters container
  if (hasActiveFilters) {
    activeFiltersDiv.classList.remove("hidden")
  } else {
    activeFiltersDiv.classList.add("hidden")
  }
}

// Thay thế hàm toggleSortOptions() hiện tại bằng phiên bản cải tiến này
function toggleSortOptions() {
  // If dropdown is already showing, just hide it
  const existingDropdown = document.querySelector(".sort-dropdown")
  if (existingDropdown) {
    existingDropdown.remove()
    // Remove overlay if it exists
    const existingOverlay = document.getElementById("dropdown-overlay-sort")
    if (existingOverlay) {
      existingOverlay.remove()
    }
    return
  }

  // Check if we're on a mobile screen
  const isMobile = window.innerWidth < 768

  // Create a dropdown menu for sorting options
  const sortDropdown = document.createElement("div")
  sortDropdown.className = "dropdown-menu p-4 w-64 right-0"
  sortDropdown.classList.add("show", "sort-dropdown")

  if (isMobile) {
    sortDropdown.classList.add("mobile-dropdown")
  }

  sortDropdown.innerHTML = `
    <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Sắp xếp theo</h4>
    <div class="space-y-2">
        <div class="dropdown-item" data-sort="title-asc">
            <i class="fas fa-sort-alpha-down text-gray-600 dark:text-gray-400"></i>
            <span class="text-gray-700 dark:text-gray-300">Tiêu đề (A-Z)</span>
        </div>
        <div class="dropdown-item" data-sort="title-desc">
            <i class="fas fa-sort-alpha-down-alt text-gray-600 dark:text-gray-400"></i>
            <span class="text-gray-700 dark:text-gray-300">Tiêu đề (Z-A)</span>
        </div>
        <div class="dropdown-item" data-sort="date-asc">
            <i class="fas fa-sort-numeric-down text-gray-600 dark:text-gray-400"></i>
            <span class="text-gray-700 dark:text-gray-300">Ngày tạo (Cũ nhất)</span>
        </div>
        <div class="dropdown-item" data-sort="date-desc">
            <i class="fas fa-sort-numeric-down-alt text-gray-600 dark:text-gray-400"></i>
            <span class="text-gray-700 dark:text-gray-300">Ngày tạo (Mới nhất)</span>
        </div>
        <div class="dropdown-item" data-sort="priority-asc">
            <i class="fas fa-sort-amount-down text-gray-600 dark:text-gray-400"></i>
            <span class="text-gray-700 dark:text-gray-300">Ưu tiên (Thấp-Cao)</span>
        </div>
        <div class="dropdown-item" data-sort="priority-desc">
            <i class="fas fa-sort-amount-down-alt text-gray-600 dark:text-gray-400"></i>
            <span class="text-gray-700 dark:text-gray-300">Ưu tiên (Cao-Thấp)</span>
        </div>
        <div class="dropdown-item" data-sort="due-date-asc">
            <i class="fas fa-calendar-alt text-gray-600 dark:text-gray-400"></i>
            <span class="text-gray-700 dark:text-gray-300">Hạn chót (Gần nhất)</span>
        </div>
        <div class="dropdown-item" data-sort="due-date-desc">
            <i class="fas fa-calendar-alt text-gray-600 dark:text-gray-400"></i>
            <span class="text-gray-700 dark:text-gray-300">Hạn chót (Xa nhất)</span>
        </div>
    </div>
  `

  if (isMobile) {
    // Create a backdrop overlay for mobile
    const overlay = document.createElement("div")
    overlay.id = "dropdown-overlay-sort"
    overlay.className = "fixed inset-0 bg-black bg-opacity-50 z-40"
    document.body.appendChild(overlay)

    // Position the dropdown for mobile view
    sortDropdown.style.position = "fixed"
    sortDropdown.style.top = "50%"
    sortDropdown.style.left = "50%"
    sortDropdown.style.transform = "translate(-50%, -50%)"
    sortDropdown.style.width = "85%"
    sortDropdown.style.maxWidth = "350px"
    sortDropdown.style.maxHeight = "80vh"
    sortDropdown.style.overflowY = "auto"
    sortDropdown.style.zIndex = "50"
    sortDropdown.style.borderRadius = "12px"
    sortDropdown.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.2)"
    sortDropdown.style.padding = "16px"

    // Add click event to close when clicking outside
    overlay.addEventListener("click", () => {
      sortDropdown.remove()
      overlay.remove()
    })
  } else {
    // Position and append the dropdown for desktop
    sortBtn.parentNode.style.position = "relative"
    sortDropdown.style.position = "absolute"
    sortDropdown.style.top = "100%"
    sortDropdown.style.right = "0"
    sortDropdown.style.width = "250px"
  }

  // Append the dropdown
  sortBtn.parentNode.appendChild(sortDropdown)

  // Add event listeners to sort options
  sortDropdown.querySelectorAll("[data-sort]").forEach((option) => {
    option.addEventListener("click", () => {
      const sortOption = option.dataset.sort
      sortTasks(sortOption)
      sortDropdown.remove()

      // Remove overlay if it exists
      const existingOverlay = document.getElementById("dropdown-overlay-sort")
      if (existingOverlay) {
        existingOverlay.remove()
      }
    })
  })

  // Close dropdown when clicking outside (for desktop)
  if (!isMobile) {
    document.addEventListener("click", function closeSort(e) {
      if (!sortDropdown.contains(e.target) && e.target !== sortBtn) {
        sortDropdown.remove()
        document.removeEventListener("click", closeSort)
      }
    })
  }
}

// Thay thế hàm toggleViewOptions() hiện tại bằng phiên bản cải tiến này
function toggleViewOptions() {
  // If dropdown is already showing, just hide it
  const existingDropdown = document.querySelector(".view-dropdown")
  if (existingDropdown) {
    existingDropdown.remove()
    // Remove overlay if it exists
    const existingOverlay = document.getElementById("dropdown-overlay-view")
    if (existingOverlay) {
      existingOverlay.remove()
    }
    return
  }

  // Check if we're on a mobile screen
  const isMobile = window.innerWidth < 768

  // Create a dropdown menu for view options
  const viewDropdown = document.createElement("div")
  viewDropdown.className = "dropdown-menu p-4 w-64 right-0"
  viewDropdown.classList.add("show", "view-dropdown")

  if (isMobile) {
    viewDropdown.classList.add("mobile-dropdown")
  }

  viewDropdown.innerHTML = `
    <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Chế độ xem</h4>
    <div class="space-y-2">
        <div class="dropdown-item ${viewMode === "board" ? "bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300" : ""}" data-view="board">
            <i class="fas fa-th-large text-gray-600 dark:text-gray-400"></i>
            <span class="text-gray-700 dark:text-gray-300">Bảng Kanban</span>
        </div>
        <div class="dropdown-item ${viewMode === "list" ? "bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300" : ""}" data-view="list">
            <i class="fas fa-list text-gray-600 dark:text-gray-400"></i>
            <span class="text-gray-700 dark:text-gray-300">Danh sách</span>
        </div>
        <div class="dropdown-item ${viewMode === "calendar" ? "bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300" : ""}" data-view="calendar">
            <i class="fas fa-calendar-alt text-gray-600 dark:text-gray-400"></i>
            <span class="text-gray-700 dark:text-gray-300">Lịch</span>
        </div>
    </div>
  `

  if (isMobile) {
    // Create a backdrop overlay for mobile
    const overlay = document.createElement("div")
    overlay.id = "dropdown-overlay-view"
    overlay.className = "fixed inset-0 bg-black bg-opacity-50 z-40"
    document.body.appendChild(overlay)

    // Position the dropdown for mobile view
    viewDropdown.style.position = "fixed"
    viewDropdown.style.top = "50%"
    viewDropdown.style.left = "50%"
    viewDropdown.style.transform = "translate(-50%, -50%)"
    viewDropdown.style.width = "85%"
    viewDropdown.style.maxWidth = "350px"
    viewDropdown.style.maxHeight = "80vh"
    viewDropdown.style.overflowY = "auto"
    viewDropdown.style.zIndex = "50"
    viewDropdown.style.borderRadius = "12px"
    viewDropdown.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.2)"
    viewDropdown.style.padding = "16px"

    // Add click event to close when clicking outside
    overlay.addEventListener("click", () => {
      viewDropdown.remove()
      overlay.remove()
    })
  } else {
    // Position and append the dropdown for desktop
    viewBtn.parentNode.style.position = "relative"
    viewDropdown.style.position = "absolute"
    viewDropdown.style.top = "100%"
    viewDropdown.style.right = "0"
    viewDropdown.style.width = "250px"
  }

  // Append the dropdown
  viewBtn.parentNode.appendChild(viewDropdown)

  // Add event listeners to view options
  viewDropdown.querySelectorAll("[data-view]").forEach((option) => {
    option.addEventListener("click", () => {
      const viewOption = option.dataset.view
      changeViewMode(viewOption)
      viewDropdown.remove()

      // Remove overlay if it exists
      const existingOverlay = document.getElementById("dropdown-overlay-view")
      if (existingOverlay) {
        existingOverlay.remove()
      }
    })
  })

  // Close dropdown when clicking outside (for desktop)
  if (!isMobile) {
    document.addEventListener("click", function closeView(e) {
      if (!viewDropdown.contains(e.target) && e.target !== viewBtn) {
        viewDropdown.remove()
        document.removeEventListener("click", closeView)
      }
    })
  }
}

function changeViewMode(mode) {
  viewMode = mode
  localStorage.setItem("viewMode", mode)

  // Update UI based on view mode
  // For now, we'll just show a toast notification
  showToast(
    "info",
    `Đã chuyển sang chế độ xem: ${mode === "board" ? "Bảng Kanban" : mode === "list" ? "Danh sách" : "Lịch"}`,
  )

  // In a real implementation, we would change the layout here
}

function sortTasks(sortOption) {
  // Sort each status array separately
  for (const status in tasks) {
    switch (sortOption) {
      case "title-asc":
        tasks[status].sort((a, b) => a.title.localeCompare(b.title))
        showToast("info", "Đã sắp xếp theo tiêu đề (A-Z)")
        break
      case "title-desc":
        tasks[status].sort((a, b) => b.title.localeCompare(a.title))
        showToast("info", "Đã sắp xếp theo tiêu đề (Z-A)")
        break
      case "date-asc":
        tasks[status].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        showToast("info", "Đã sắp xếp theo ngày tạo (Cũ nhất)")
        break
      case "date-desc":
        tasks[status].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        showToast("info", "Đã sắp xếp theo ngày tạo (Mới nhất)")
        break
      case "priority-asc":
        tasks[status].sort((a, b) => {
          const priorityOrder = { low: 1, medium: 2, high: 3 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        })
        showToast("info", "Đã sắp xếp theo ưu tiên (Thấp-Cao)")
        break
      case "priority-desc":
        tasks[status].sort((a, b) => {
          const priorityOrder = { low: 1, medium: 2, high: 3 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        })
        showToast("info", "Đã sắp xếp theo ưu tiên (Cao-Thấp)")
        break
      case "due-date-asc":
        tasks[status].sort((a, b) => {
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        })
        showToast("info", "Đã sắp xếp theo hạn chót (Gần nhất)")
        break
      case "due-date-desc":
        tasks[status].sort((a, b) => {
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(b.dueDate) - new Date(a.dueDate)
        })
        showToast("info", "Đã sắp xếp theo hạn chót (Xa nhất)")
        break
    }
  }

  // Save to localStorage and refresh board
  saveTasksToLocalStorage()
  initializeBoard()
}

function toggleDarkModeHandler() {
  document.documentElement.classList.toggle("dark")

  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("darkMode", "true")
  } else {
    localStorage.setItem("darkMode", "false")
  }
}

function toggleStats() {
  statsSection.classList.toggle("hidden")

  if (!statsSection.classList.contains("hidden")) {
    updateStatistics()
    animateCharts()
  }
}

function updateStatistics() {
  // Count tasks by status
  const totalTasks = tasks.todo.length + tasks.inprogress.length + tasks.done.length
  const todoTasksCount = tasks.todo.length
  const inprogressTasksCount = tasks.inprogress.length
  const doneTasksCount = tasks.done.length

  // Update task counts
  totalTasksElement.textContent = totalTasks
  todoTasksElement.textContent = todoTasksCount
  inprogressTasksElement.textContent = inprogressTasksCount
  doneTasksElement.textContent = doneTasksCount

  // Calculate percentages
  const todoPercent = totalTasks > 0 ? Math.round((todoTasksCount / totalTasks) * 100) : 0
  const inprogressPercent = totalTasks > 0 ? Math.round((inprogressTasksCount / totalTasks) * 100) : 0
  const donePercent = totalTasks > 0 ? Math.round((doneTasksCount / totalTasks) * 100) : 0

  // Update percentage displays
  todoTasksPercentElement.textContent = `${todoPercent}% của`
  inprogressTasksPercentElement.textContent = `${inprogressPercent}% của`
  doneTasksPercentElement.textContent = `${donePercent}% của`

  // Update chart values
  chartBars[0].dataset.value = todoTasksCount
  chartBars[1].dataset.value = inprogressTasksCount
  chartBars[2].dataset.value = doneTasksCount

  // Update chart value displays
  chartBars[0].querySelector(".chart-value").textContent = todoTasksCount
  chartBars[1].querySelector(".chart-value").textContent = inprogressTasksCount
  chartBars[2].querySelector(".chart-value").textContent = doneTasksCount

  // Calculate task change from previous day
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  const newTasksToday = taskHistory.filter((record) => {
    const recordDate = new Date(record.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return recordDate >= today
  }).length

  if (newTasksToday > 0) {
    totalTasksChangeElement.textContent = `+${newTasksToday} hôm nay`
    totalTasksChangeElement.className = "font-medium text-success-600 dark:text-success-400"
  } else if (newTasksToday < 0) {
    totalTasksChangeElement.textContent = `${newTasksToday} hôm nay`
    totalTasksChangeElement.className = "font-medium text-danger-600 dark:text-danger-400"
  } else {
    totalTasksChangeElement.textContent = "Không thay đổi hôm nay"
    totalTasksChangeElement.className = "font-medium text-gray-600 dark:text-gray-400"
  }

  // Update tag distribution
  updateTagDistribution()
}

function updateTagDistribution() {
  // Get all tasks
  const allTasks = [...tasks.todo, ...tasks.inprogress, ...tasks.done]

  // Count tasks by tag
  const tagCounts = {
    work: 0,
    personal: 0,
    study: 0,
    health: 0,
    finance: 0,
  }

  allTasks.forEach((task) => {
    if (task.tags) {
      task.tags.forEach((tag) => {
        if (tagCounts.hasOwnProperty(tag)) {
          tagCounts[tag]++
        }
      })
    }
  })

  // Update tag count elements
  for (const tag in tagCounts) {
    if (tagCountElements[tag]) {
      tagCountElements[tag].textContent = tagCounts[tag]
    }
  }

  // Calculate percentages and update bars
  const totalTagged = Object.values(tagCounts).reduce((sum, count) => sum + count, 0)

  for (const tag in tagCounts) {
    if (tagDistributionBars[tag]) {
      const percent = totalTagged > 0 ? (tagCounts[tag] / totalTagged) * 100 : 0
      tagDistributionBars[tag].style.width = `${percent}%`
    }
  }
}

function animateCharts() {
  // Get the maximum value for scaling
  const values = Array.from(chartBars).map((bar) => Number.parseInt(bar.dataset.value))
  const maxValue = Math.max(...values, 1) // Ensure we don't divide by zero

  // Animate each bar
  chartBars.forEach((bar) => {
    const value = Number.parseInt(bar.dataset.value)
    const height = (value / maxValue) * 100

    // Reset height first
    bar.style.height = "0%"

    // Animate to the correct height
    setTimeout(() => {
      bar.style.height = `${Math.max(height, 5)}%` // Minimum 5% height for visibility
    }, 100)
  })
}

// Drag and Drop Functionality
function setupDragAndDrop() {
  const taskLists = document.querySelectorAll(".task-list")

  taskLists.forEach((list) => {
    list.addEventListener("dragover", handleDragOver)
    list.addEventListener("dragenter", handleDragEnter)
    list.addEventListener("dragleave", handleDragLeave)
    list.addEventListener("drop", handleDrop)
  })
}

function handleDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.id)
  e.target.classList.add("dragging")
  setTimeout(() => {
    e.target.classList.add("opacity-50")
  }, 0)
}

function handleDragOver(e) {
  e.preventDefault()
}

function handleDragEnter(e) {
  e.preventDefault()
  if (e.target.classList.contains("task-list")) {
    e.target.classList.add("drag-over")
  }
}

function handleDragLeave(e) {
  if (e.target.classList.contains("task-list")) {
    e.target.classList.remove("drag-over")
  }
}

function handleDrop(e) {
  e.preventDefault()

  // Remove drag-over class
  if (e.target.classList.contains("task-list")) {
    e.target.classList.remove("drag-over")
  }

  // Get the dragged task id
  const taskId = e.dataTransfer.getData("text/plain")
  const draggedElement = document.querySelector(`[data-id="${taskId}"]`)

  if (draggedElement) {
    draggedElement.classList.remove("dragging", "opacity-50")

    // Get the target column
    let targetColumn = e.target
    while (targetColumn && !targetColumn.classList.contains("task-list")) {
      targetColumn = targetColumn.parentElement
    }

    if (targetColumn) {
      const newStatus = targetColumn.id.replace("-list", "")
      moveTask(taskId, newStatus)
    }
  }
}

function moveTask(taskId, newStatus) {
  // Find the task
  let taskToMove = null
  let oldStatus = null

  for (const status in tasks) {
    const taskIndex = tasks[status].findIndex((t) => t.id === taskId)
    if (taskIndex !== -1) {
      taskToMove = tasks[status][taskIndex]
      oldStatus = status
      // Remove from old status
      tasks[status].splice(taskIndex, 1)
      break
    }
  }

  if (taskToMove && oldStatus !== newStatus) {
    // Update task status
    taskToMove.status = newStatus
    taskToMove.updatedAt = new Date().toISOString()

    // Add to new status
    tasks[newStatus].push(taskToMove)

    // Add to task history
    taskHistory.push({
      id: taskToMove.id,
      status: newStatus,
      date: new Date().toISOString(),
    })

    // Save to localStorage
    saveTasksToLocalStorage()
    localStorage.setItem("taskHistory", JSON.stringify(taskHistory))

    // Show toast notification
    const statusText = newStatus === "todo" ? "Cần làm" : newStatus === "inprogress" ? "Đang làm" : "Hoàn thành"
    showToast("success", `Đã chuyển công việc sang ${statusText}`)

    // If moved to done, show confetti
    if (newStatus === "done" && oldStatus !== "done") {
      createConfetti()
    }

    // Refresh board
    initializeBoard()
    updateStatistics()
  }
}

function showToast(type, message) {
  // Set toast type
  toast.className = "toast"

  const toastColors = {
    success: "bg-success-500",
    error: "bg-danger-500",
    info: "bg-info-500",
    warning: "bg-warning-500",
  }

  toast.classList.add(toastColors[type] || "bg-gray-700")

  // Set icon based on type
  let iconClass = ""
  switch (type) {
    case "success":
      iconClass = "fas fa-check-circle"
      break
    case "error":
      iconClass = "fas fa-exclamation-circle"
      break
    case "info":
      iconClass = "fas fa-info-circle"
      break
    case "warning":
      iconClass = "fas fa-exclamation-triangle"
      break
  }

  toastIcon.className = iconClass
  toastMessage.textContent = message

  // Show toast
  toast.classList.add("show")

  // Auto hide after 3 seconds
  setTimeout(hideToast, 3000)
}

function hideToast() {
  toast.classList.remove("show")
}

function createConfetti() {
  const colors = ["#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f"]

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div")
    confetti.className = "confetti"
    confetti.style.left = `${Math.random() * 100}vw`
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.animationDelay = `${Math.random() * 3}s`

    document.body.appendChild(confetti)

    // Remove confetti after animation
    setTimeout(() => {
      confetti.remove()
    }, 3000)
  }
}

function openTemplatesModal() {
  renderTemplates()
  templatesModal.classList.add("show")
  templatesModal.classList.remove("hidden")
}

function closeTemplatesModalFunc() {
  templatesModal.classList.remove("show")
  setTimeout(() => {
    templatesModal.classList.add("hidden")
  }, 300)
}

function renderTemplates() {
  templatesContainer.innerHTML = ""

  if (taskTemplates.length === 0) {
    templatesContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400">
                    <i class="fas fa-clipboard-list text-3xl mb-2"></i>
                    <p>Không có mẫu công việc nào</p>
                </div>
            `
    return
  }

  const searchTerm = templateSearch.value.toLowerCase()
  const filteredTemplates = searchTerm
    ? taskTemplates.filter(
        (template) =>
          template.title.toLowerCase().includes(searchTerm) ||
          (template.description && template.description.toLowerCase().includes(searchTerm)),
      )
    : taskTemplates

  filteredTemplates.forEach((template) => {
    const templateCard = document.createElement("div")
    templateCard.className = "template-card"
    templateCard.dataset.id = template.id

    // Format tags
    let tagsHTML = ""
    if (template.tags && template.tags.length > 0) {
      tagsHTML = '<div class="template-tags">'
      template.tags.forEach((tag) => {
        const tagLabel =
          tag === "work"
            ? "Công việc"
            : tag === "personal"
              ? "Cá nhân"
              : tag === "study"
                ? "Học tập"
                : tag === "health"
                  ? "Sức khỏe"
                  : "Tài chính"
        tagsHTML += `<span class="template-tag">${tagLabel}</span>`
      })
      tagsHTML += "</div>"
    }

    templateCard.innerHTML = `
                <div class="template-title text-gray-800 dark:text-white">${template.title}</div>
                <div class="template-description">${template.description || "Không có mô tả"}</div>
                ${tagsHTML}
            `

    // Add click event to select template
    templateCard.addEventListener("click", () => {
      // Deselect all templates
      document.querySelectorAll(".template-card").forEach((card) => {
        card.classList.remove("border-primary-500", "bg-primary-50", "dark:bg-primary-900")
      })

      // Select this template
      templateCard.classList.add("border-primary-500", "bg-primary-50", "dark:bg-primary-900")
    })

    templatesContainer.appendChild(templateCard)
  })
}

function filterTemplates() {
  renderTemplates()
}

function createTemplate() {
  // For now, we'll just open the task modal and save as template
  modalTitle.textContent = "Tạo mẫu công việc mới"
  taskIdInput.value = ""
  taskStatusInput.value = "todo"
  taskTitleInput.value = ""
  taskDescriptionInput.value = ""
  taskPriorityInput.value = "medium"
  taskDueDateInput.value = ""

  // Clear subtasks
  subtasksContainer.innerHTML = ""
  newSubtaskInput.value = ""

  // Clear tag checkboxes
  document.querySelectorAll(".tag-checkbox").forEach((checkbox) => {
    checkbox.checked = false
  })

  // Change save button text
  const saveBtn = document.getElementById("save-task-btn")
  saveBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Lưu làm mẫu'

  // Override form submit handler temporarily
  const originalSubmitHandler = taskForm.onsubmit
  taskForm.onsubmit = (e) => {
    e.preventDefault()

    const title = taskTitleInput.value
    const description = taskDescriptionInput.value
    const priority = taskPriorityInput.value

    // Get selected tags
    const tags = []
    document.querySelectorAll(".tag-checkbox:checked").forEach((checkbox) => {
      tags.push(checkbox.value)
    })

    // Get subtasks
    const subtasks = []
    const subtaskItems = subtasksContainer.querySelectorAll(".subtask-item")
    subtaskItems.forEach((item, index) => {
      const textInput = item.querySelector(`input[name="subtask-text-${index}"]`)
      const completedInput = item.querySelector(`input[name="subtask-completed-${index}"]`)

      if (textInput && completedInput) {
        subtasks.push({
          text: textInput.value,
          completed: false, // Always false for templates
        })
      }
    })

    const template = {
      id: "template-" + Date.now(),
      title,
      description,
      priority,
      tags,
      subtasks,
    }

    // Add to templates
    taskTemplates.push(template)

    // Save to localStorage
    localStorage.setItem("taskTemplates", JSON.stringify(taskTemplates))

    // Show toast notification
    showToast("success", "Mẫu công việc mới đã được tạo thành công!")

    // Close modal
    closeTaskModal()

    // Restore original submit handler
    taskForm.onsubmit = originalSubmitHandler

    // Reopen templates modal
    openTemplatesModal()
  }

  // Show task modal
  taskModal.classList.add("show")
  taskModal.classList.remove("hidden")

  // Focus on title input
  setTimeout(() => {
    taskTitleInput.focus()
  }, 100)

  // Close templates modal
  closeTemplatesModalFunc()
}

function useSelectedTemplate() {
  const selectedTemplate = document.querySelector(".template-card.border-primary-500")
  if (!selectedTemplate) {
    showToast("warning", "Vui lòng chọn một mẫu công việc")
    return
  }

  const templateId = selectedTemplate.dataset.id
  const template = taskTemplates.find((t) => t.id === templateId)

  if (template) {
    // Open task modal with template data
    modalTitle.textContent = "Thêm công việc từ mẫu"
    taskIdInput.value = ""
    taskStatusInput.value = "todo"
    taskTitleInput.value = template.title
    taskDescriptionInput.value = template.description || ""
    taskPriorityInput.value = template.priority || "medium"
    taskDueDateInput.value = ""

    // Set tag checkboxes
    document.querySelectorAll(".tag-checkbox").forEach((checkbox) => {
      checkbox.checked = template.tags && template.tags.includes(checkbox.value)
    })

    // Render subtasks
    subtasksContainer.innerHTML = ""
    if (template.subtasks && template.subtasks.length > 0) {
      template.subtasks.forEach((subtask, index) => {
        addSubtaskToForm(subtask.text, false, index)
      })
    }

    // Show task modal
    taskModal.classList.add("show")
    taskModal.classList.remove("hidden")

    // Focus on title input
    setTimeout(() => {
      taskTitleInput.focus()
    }, 100)

    // Close templates modal
    closeTemplatesModalFunc()
  }
}

function openArchiveModal() {
  renderArchivedTasks()
  archiveModal.classList.add("show")
  archiveModal.classList.remove("hidden")
}

function closeArchiveModalFunc() {
  archiveModal.classList.remove("show")
  setTimeout(() => {
    archiveModal.classList.add("hidden")
  }, 300)
}

function renderArchivedTasks() {
  archiveContainer.innerHTML = ""

  if (archivedTasks.length === 0) {
    archiveContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400">
                    <i class="fas fa-archive text-3xl mb-2"></i>
                    <p>Không có công việc nào đã lưu trữ</p>
                </div>
            `
    return
  }

  const searchTerm = archiveSearch.value.toLowerCase()
  const filteredArchivedTasks = searchTerm
    ? archivedTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm) ||
          (task.description && task.description.toLowerCase().includes(searchTerm)),
      )
    : archivedTasks

  filteredArchivedTasks.forEach((task) => {
    const taskCard = document.createElement("div")
    taskCard.className = "task-card bg-white dark:bg-gray-800 p-4 rounded-lg shadow-card hover:shadow-card-hover mb-3"
    taskCard.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-semibold text-gray-800 dark:text-white">${task.title}</h3>
                </div>
                <p class="text-gray-600 dark:text-gray-300 text-sm">${task.description || "Không có mô tả"}</p>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Đã lưu trữ: ${formatDate(task.archivedAt)}
                </div>
            `
    archiveContainer.appendChild(taskCard)
  })
}

function filterArchivedTasks() {
  renderArchivedTasks()
}
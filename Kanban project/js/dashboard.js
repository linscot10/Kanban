let draggedTaskId = null;
const user = JSON.parse(localStorage.getItem('taskManagerUser'));

if (!user) {
    window.location.href = 'login.html'
} else {
    document.getElementById("greeting").textContent = `Hi , ${user.username}`
}

document.getElementById('logoutBtn').addEventListener("click", () => {
    localStorage.removeItem("taskManagerUser")
    window.location.href = "login.html";
})

let tasks = JSON.parse(localStorage.getItem('tasks')) || []

const taskForm = document.getElementById('taskForm')
const taskList = document.getElementById('taskList')

taskForm.addEventListener("submit", (e) => {
    e.preventDefault()


    const title = document.getElementById('title').value.trim()
    const description = document.getElementById('description').value.trim()
    const dueDate = document.getElementById('dueDate').value
    const priority = document.getElementById('priority').value

    if (!title || !dueDate || !priority) {
        alert("Fill All Required fields")
        return;
    }

    const task = {
        id: Date.now(),
        title,
        description,
        dueDate,
        priority,
        status: "To Do",
        createdBy: user.username
    }
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks))
    taskForm.reset()
    renderTasks()

})


function renderTasks() {
    // drag drop
    document.getElementById("todo").innerHTML = "";
    document.getElementById("inprogress").innerHTML = "";
    document.getElementById("done").innerHTML = "";

    tasks.forEach(task => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("card", "shadow-sm", "mb-3", "p-2");
        taskCard.setAttribute("draggable", "true");
        taskCard.setAttribute("ondragstart", `onDragStart(event, ${task.id})`);
        taskCard.classList.add(`border-start`, `border-5`, `border-${getPriorityColor(task.priority)}`);

        taskCard.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.description || "No description."}</p>
            <p><strong>Due:</strong> ${task.dueDate}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <button class="btn btn-sm btn-primary me-2" onclick="openEditModal(${task.id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
          </div>
        `;

        // Append to correct column
        if (task.status === "To Do") {
            document.getElementById("todo").appendChild(taskCard);
        } else if (task.status === "In Progress") {
            document.getElementById("inprogress").appendChild(taskCard);
        } else if (task.status === "Done") {
            document.getElementById("done").appendChild(taskCard);
        }
    });


    // normal to do list
    // taskList.innerHTML = ""
    // const userTasks = tasks.filter((t) => t.createdBy === user.username)

    // if (userTasks.length === 0) {
    //     taskList.innerHTML = `<p class="text-muted">No tasks added yet.</p>`;
    //     return;
    // }

    // userTasks.forEach((task) => {
    //     const taskCard = document.createElement('div')
    //     taskCard.className = 'col-md-6'
    //     taskCard.innerHTML = `
    //   <div class="card shadow-sm border-start border-5 border-${getPriorityColor(task.priority)}">
    //     <div class="card-body">
    //       <h5 class="card-title">${task.title}</h5>
    //       <p class="card-text">${task.description || "No description."}</p>
    //       <p class="mb-1"><strong>Due:</strong> ${task.dueDate}</p>
    //       <p class="mb-2"><strong>Priority:</strong> ${task.priority}</p>
    //       <span class="badge bg-secondary"><strong>Status:</strong>${task.status}</span>
    //        <button class="btn btn-sm btn-primary me-2" onclick="openEditModal(${task.id})">Edit</button>
    //   <button class="btn btn-sm btn-danger me-2" onclick="deleteTask(${task.id})">Delete</button>
    //   <button class="btn btn-sm btn-secondary" onclick="updateStatus(${task.id})">Next Status</button>
    //     </div>
    //   </div>
    // `;
    //     taskList.appendChild(taskCard);

    // });
}

function getPriorityColor(priority) {
    switch (priority) {
        case "High":
            return "danger";
        case "Medium":
            return "warning";
        case "Low":
            return "success";
        default:
            return "secondary";
    }
}


renderTasks()

function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId)

    document.getElementById('editTaskId').value = task.id
    document.getElementById('editTitle').value = task.title
    document.getElementById('editDescription').value = task.description
    document.getElementById('editDueDate').value = task.dueDate
    document.getElementById('editPriority').value = task.priority


    const editModal = new bootstrap.Modal(document.getElementById('editTaskModal'))
    editModal.show()
}

document.getElementById("editTaskForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const id = parseInt(document.getElementById("editTaskId").value)
    const taskIndex = tasks.findIndex(t => t.id === id)

    tasks[taskIndex].title = document.getElementById("editTitle").value.trim();
    tasks[taskIndex].description = document.getElementById("editDescription").value.trim();
    tasks[taskIndex].dueDate = document.getElementById("editDueDate").value;
    tasks[taskIndex].priority = document.getElementById("editPriority").value;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    const editModal = bootstrap.Modal.getInstance(document.getElementById("editTaskModal"));
    editModal.hide();

    renderTasks();
})


function deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
}

function updateStatus(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    const currentStatus = tasks[taskIndex].status;

    const nextStatus = {
        "To Do": "In Progress",
        "In Progress": "Done",
        "Done": "To Do"
    };

    tasks[taskIndex].status = nextStatus[currentStatus];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}



function onDragStart(event, taskId) {

    draggedTaskId = taskId;
}

function allowDrop(event) {
    event.preventDefault(); // Allow drop
}


function onDrop(event, newStatus) {
    event.preventDefault();

    const taskIndex = tasks.findIndex(t => t.id === draggedTaskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks(); // Re-render board
    }
}
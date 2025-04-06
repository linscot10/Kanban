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

let tasks = JSON.parse(localStorage.getItem('task')) || []

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
    taskList.innerHTML = ""
    const userTasks = tasks.filter((t) => t.createdBy === user.username)

    if (userTasks.length === 0) {
        taskList.innerHTML = `<p class="text-muted">No tasks added yet.</p>`;
        return;
    }

    userTasks.forEach((task) => {
        const taskCard = document.createElement('div')
        taskCard.className = 'col-md-6'
        taskCard.innerHTML = `
      <div class="card shadow-sm border-start border-5 border-${getPriorityColor(task.priority)}">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description || "No description."}</p>
          <p class="mb-1"><strong>Due:</strong> ${task.dueDate}</p>
          <p class="mb-2"><strong>Priority:</strong> ${task.priority}</p>
          <span class="badge bg-secondary">${task.status}</span>
        </div>
      </div>
    `;
        taskList.appendChild(taskCard);

    });
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
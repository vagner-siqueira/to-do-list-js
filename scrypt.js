const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const clearDoneBtn = document.getElementById("clearDoneBtn");
const markAllBtn = document.getElementById("markAllBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let clickTimer = null;

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const newTask = {
        id: Date.now(),
        title: taskText,
        done: false
    };

    tasks.push(newTask);
    taskInput.value = "";
    renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") addTask();
});

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => !task.done);
    } else if (currentFilter === "done") {
    filteredTasks = tasks.filter(task => task.done);
    }

    filteredTasks.forEach(function (task) {
        const li = document.createElement("li");
        li.dataset.id = String(task.id);

        const span = document.createElement("span");
        span.textContent = task.title;

        if (task.done) span.classList.add("done");

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";

        li.appendChild(span);
        li.appendChild(removeBtn);
        taskList.appendChild(li);
    });

    const pending = tasks.filter(task => !task.done).length;
    counter.textContent = `Pendentes: ${pending} | Total: ${tasks.length}`;

    localStorage.setItem("tasks", JSON.stringify(tasks));
} // ✅ FECHA renderTasks AQUI

// ✅ listeners fora do renderTasks (rodam só 1 vez)
document.querySelectorAll("#filters button").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll("#filters button").forEach(button => {
            button.classList.remove("active");
        });
        button.classList.add("active");
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

taskList.addEventListener("click", function (event) {
    const li = event.target.closest("li");
    if (!li) return;
    
    console.log(event.target.tagName, li.dataset.id);

    const id = Number(li.dataset.id);

  // clicou no botão ❌
    if (event.target.tagName === "BUTTON") {
        li.classList.add("removing");
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
        }, 300);
        return;
    }

  // clicou no item (li / span)
    const task = tasks.find(task => task.id === id);
    if (!task) return;

    console.log("clicou na tarefa", id);
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
        task.done = !task.done;
        renderTasks();
    }, 200);
});

taskList.addEventListener("dblclick", function (event) {
    clearTimeout(clickTimer);
    if (event.target.tagName !== "SPAN") return;
    const span = event.target;
    console.log(span.textContent);
    console.log("Editar Tarefa");
    const input = document.createElement("input");
    input.value = span.textContent;
    span.replaceWith(input);
    input.focus();
    input.addEventListener("keydown", function(event) {
        console.log("tecla:", event.key);
        if (event.key === "Enter") {
            const li = input.closest("li");
            const id = Number(li.dataset.id);
            const task = tasks.find(task => task.id === id);
            if (input.value.trim() === "") {
                renderTasks();
                return;
            }
            task.title = input.value.trim()
            renderTasks();
        }
    });
});

clearDoneBtn.addEventListener("click", function() {
  tasks = tasks.filter(task => !task.done);
  renderTasks();
});

markAllBtn.addEventListener("click", function() {
    const hasPending = tasks.some(task => !task.done);
    tasks.forEach(task => {
        task.done = hasPending;
        });
    renderTasks();
});

// ✅ renderiza quando abre
renderTasks();
console.log("taskList:", taskList);
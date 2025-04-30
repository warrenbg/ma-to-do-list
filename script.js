const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const clearAllButton = document.getElementById('clearAllButton');

document.addEventListener('DOMContentLoaded', loadTasks);

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

clearAllButton.addEventListener('click', clearAllTasks);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const taskItem = createTaskElement(taskText);
    taskList.appendChild(taskItem);
    saveTasks();
    updateTaskCounter();
    taskInput.value = "";
    sortTasks();
}

function createTaskElement(text) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.textContent = text;

    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTasks();
        updateTaskCounter();
        sortTasks();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "❌";
    deleteButton.className = 'delete';
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        li.remove();
        saveTasks();
        updateTaskCounter();
        sortTasks();
    });

    li.appendChild(deleteButton);
    return li;
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        tasks.push({
            text: item.firstChild.textContent.trim(),
            completed: item.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text);
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskList.appendChild(taskItem);
    });
    updateTaskCounter();
    sortTasks();
}

function updateTaskCounter() {
    const totalTasks = document.querySelectorAll('.task-item:not(.completed)').length;
    taskCounter.textContent = `Tâches restantes : ${totalTasks}`;
}

function clearAllTasks() {
    if (confirm("Êtes-vous sûr de vouloir tout effacer ?")) {
        taskList.innerHTML = '';
        localStorage.removeItem('tasks');
        updateTaskCounter();
    }
}

function sortTasks() {
    const tasks = Array.from(taskList.children);
    tasks.sort((a, b) => {
        return a.classList.contains('completed') - b.classList.contains('completed');
    });
    tasks.forEach(task => taskList.appendChild(task));
}

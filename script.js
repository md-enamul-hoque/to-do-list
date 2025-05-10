document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Render tasks based on current filter
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.index = index;
            
            taskItem.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            
            taskList.appendChild(taskItem);
        });
        
        // Add event listeners to checkboxes, edit and delete buttons
        document.querySelectorAll('.checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTaskComplete);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editTask);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });
    }
    
    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            saveTasks();
            taskInput.value = '';
            renderTasks();
        }
    }
    
    // Toggle task completion status
    function toggleTaskComplete(e) {
        const taskIndex = e.target.closest('.task-item').dataset.index;
        tasks[taskIndex].completed = e.target.checked;
        saveTasks();
        renderTasks();
    }
    
    // Edit a task
    function editTask(e) {
        const taskItem = e.target.closest('.task-item');
        const taskIndex = taskItem.dataset.index;
        const taskTextElement = taskItem.querySelector('.task-text');
        const currentText = tasks[taskIndex].text;
        
        const newText = prompt('Edit your task:', currentText);
        if (newText !== null && newText.trim() !== '') {
            tasks[taskIndex].text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }
    
    // Delete a task
    function deleteTask(e) {
        if (confirm('Are you sure you want to delete this task?')) {
            const taskIndex = e.target.closest('.task-item').dataset.index;
            tasks.splice(taskIndex, 1);
            saveTasks();
            renderTasks();
        }
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Filter tasks
    function filterTasks(e) {
        currentFilter = e.target.dataset.filter;
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderTasks();
    }
    
    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', filterTasks);
    });
    
    // Initial render
    renderTasks();
});
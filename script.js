document.addEventListener('DOMContentLoaded', () => {
    // ---- Todo List Logic ----
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No tasks yet. Add one above!';
            taskList.appendChild(emptyState);
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.id = `task-${task.id}`;

            li.innerHTML = `
                <div class="task-content" onclick="toggleTask(${task.id})">
                    <div class="checkbox">
                        <svg class="checkbox-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <span class="task-text">${escapeHTML(task.text)}</span>
                </div>
                <button class="delete-btn" onclick="deleteTask(${task.id})" aria-label="Delete task">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            `;
            taskList.appendChild(li);
        });
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();

        if (text) {
            const newTask = {
                id: Date.now(),
                text: text,
                completed: false
            };

            tasks.unshift(newTask);
            saveTasks();
            renderTasks();
            taskInput.value = '';
            taskInput.focus();
        }
    });

    window.toggleTask = (id) => {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    };

    window.deleteTask = (id) => {
        const taskElement = document.getElementById(`task-${id}`);

        if (taskElement) {
            taskElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            taskElement.style.transform = 'scale(0.95)';
            taskElement.style.opacity = '0';

            setTimeout(() => {
                tasks = tasks.filter(task => task.id !== id);
                saveTasks();
                renderTasks();
            }, 300);
        } else {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        }
    };

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    renderTasks();

    // ---- Feedback Form Logic ----
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackSuccess = document.getElementById('feedback-success');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show success message
            feedbackSuccess.style.display = 'block';

            // Reset form
            feedbackForm.reset();

            // Hide message after 3 seconds
            setTimeout(() => {
                feedbackSuccess.style.display = 'none';

                // Let the user know the feedback was submitted since there's no real backend
                console.log("Feedback simulated submission to server.");
            }, 3000);
        });
    }
});

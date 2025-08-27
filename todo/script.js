document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');
    const historyButton = document.getElementById('historyButton');
    const historyModalBody = document.getElementById('historyModalBody');

    const TASKS_KEY = 'todo_tasks_all';

    // --- データ操作 --- //
    const getTasks = () => JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
    const saveTasks = (tasks) => localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

    // --- 画面描画 --- //
    const renderTasks = () => {
        const tasks = getTasks();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
        sortTasks();
    };

    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.dataset.id = task.id;
        if (task.completed) li.classList.add('completed');
        if (task.dueDate) li.dataset.dueDate = task.dueDate;

        const taskDetailsDiv = document.createElement('div');
        taskDetailsDiv.className = 'task-details';

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        span.addEventListener('click', () => toggleTaskCompletion(task.id));

        taskDetailsDiv.appendChild(span);

        if (task.dueDate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.className = 'due-date';
            dueDateSpan.textContent = `期限: ${task.dueDate}`;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (new Date(task.dueDate) < today && !task.completed) {
                dueDateSpan.classList.add('overdue');
            }
            taskDetailsDiv.appendChild(dueDateSpan);
        }

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(taskDetailsDiv);
        li.appendChild(deleteButton);
        return li;
    };

    // --- タスク操作ロジック --- //
    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            dueDate: dueDateInput.value || '',
            completedDate: null
        };

        const tasks = getTasks();
        tasks.push(newTask);
        saveTasks(tasks);

        renderTasks();
        taskInput.value = '';
        dueDateInput.value = '';
        taskInput.focus();
    };

    const deleteTask = (taskId) => {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks(tasks);
        renderTasks();
    };

    const toggleTaskCompletion = (taskId) => {
        let tasks = getTasks();
        const task = tasks.find(task => task.id === taskId);
        if (!task) return;

        task.completed = !task.completed;
        task.completedDate = task.completed ? new Date().toISOString().split('T')[0] : null;

        saveTasks(tasks);
        renderTasks();
    };

    const sortTasks = () => {
        const tasks = Array.from(taskList.querySelectorAll('li'));
        tasks.sort((a, b) => {
            const dateA = a.dataset.dueDate ? new Date(a.dataset.dueDate) : null;
            const dateB = b.dataset.dueDate ? new Date(b.dataset.dueDate) : null;
            if (dateA && dateB) return dateA - dateB;
            if (dateA) return -1;
            if (dateB) return 1;
            return 0;
        });
        tasks.forEach(task => taskList.appendChild(task));
    };

    // --- 振り返り機能 --- //
    const showHistory = () => {
        const allTasks = getTasks();
        const completedTasks = allTasks.filter(task => task.completed && task.completedDate);
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentDate = today.getDate();

        const matchedTasks = completedTasks.filter(task => {
            const completedDate = new Date(task.completedDate);
            return (completedDate.getMonth() + 1) === currentMonth && completedDate.getDate() === currentDate;
        });

        historyModalBody.innerHTML = '';
        if (matchedTasks.length === 0) {
            historyModalBody.innerHTML = '<p>過去の同じ日に完了したタスクは見つかりませんでした。</p>';
            return;
        }

        matchedTasks.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));

        matchedTasks.forEach(task => {
            const yearDiff = today.getFullYear() - new Date(task.completedDate).getFullYear();
            let message = yearDiff === 1 ? `ちょうど1年前の今日` : (yearDiff > 1 ? `${yearDiff}年前の今日` : `今年の今日`);

            const taskEl = document.createElement('div');
            taskEl.className = 'alert alert-success';
            taskEl.innerHTML = `<strong>${message}</strong><br>${task.text}`;
            historyModalBody.appendChild(taskEl);
        });
    };

    // --- 初期化 --- //
    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    historyButton.addEventListener('click', showHistory);

    renderTasks();
});
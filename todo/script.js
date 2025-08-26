document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');
    const COOKIE_NAME = 'todo_tasks';

    // タスクを期限日順にソートする関数
    const sortTasks = () => {
        const tasks = Array.from(taskList.querySelectorAll('li'));

        tasks.sort((a, b) => {
            const dateA = a.dataset.dueDate ? new Date(a.dataset.dueDate) : null;
            const dateB = b.dataset.dueDate ? new Date(b.dataset.dueDate) : null;

            if (dateA && dateB) {
                return dateA - dateB;
            } else if (dateA) {
                return -1; // Aには日付があり、Bにはない -> Aを前に
            } else if (dateB) {
                return 1;  // Bには日付があり、Aにはない -> Bを前に
            } else {
                return 0;  // 両方日付なし
            }
        });

        // DOMを並び替え
        tasks.forEach(task => taskList.appendChild(task));
    };

    // Cookieにタスクリストを保存する関数
    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed'),
                dueDate: li.dataset.dueDate || ''
            });
        });
        const date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();
        document.cookie = `${COOKIE_NAME}=${JSON.stringify(tasks)}${expires}; path=/`;
    };

    // タスク要素を作成する関数
    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        if (task.completed) {
            li.classList.add('completed');
        }
        if (task.dueDate) {
            li.dataset.dueDate = task.dueDate;
        }

        const taskDetailsDiv = document.createElement('div');
        taskDetailsDiv.className = 'task-details';

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        span.addEventListener('click', () => {
            li.classList.toggle('completed');
            // 期限切れスタイルの更新が必要なため、再描画
            sortTasks();
            saveTasks();
        });

        taskDetailsDiv.appendChild(span);

        if (task.dueDate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.className = 'due-date';
            dueDateSpan.textContent = `期限: ${task.dueDate}`;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dueDate = new Date(task.dueDate);

            if (dueDate < today && !task.completed) {
                dueDateSpan.classList.add('overdue');
            }
            taskDetailsDiv.appendChild(dueDateSpan);
        }

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(li);
            saveTasks();
        });

        li.appendChild(taskDetailsDiv);
        li.appendChild(deleteButton);
        return li;
    };

    // Cookieからタスクを読み込んで表示する関数
    const loadTasks = () => {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === COOKIE_NAME) {
                try {
                    const tasks = JSON.parse(value);
                    tasks.forEach(task => {
                        const taskElement = createTaskElement(task);
                        taskList.appendChild(taskElement);
                    });
                } catch (e) {
                    console.error('Failed to parse tasks from cookie:', e);
                }
                break;
            }
        }
        sortTasks(); // 読み込み後にもソート
    };

    // 新しいタスクを追加する関数
    const addTask = () => {
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        if (taskText === '') {
            return;
        }

        const task = { text: taskText, completed: false, dueDate: dueDate };
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);

        sortTasks(); // 追加後にもソート
        saveTasks();
        taskInput.value = '';
        dueDateInput.value = '';
        taskInput.focus();
    };

    // イベントリスナーの設定
    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // ページ読み込み時にタスクをロード
    loadTasks();
});
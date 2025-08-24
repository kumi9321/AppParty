document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');
    const COOKIE_NAME = 'todo_tasks';

    // Cookieにタスクリストを保存する関数
    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        // Cookieの有効期限を30日に設定
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

        const span = document.createElement('span');
        span.textContent = task.text;
        span.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(li);
            saveTasks();
        });

        li.appendChild(span);
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
    };

    // 新しいタスクを追加する関数
    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            return; // 入力が空の場合は何もしない
        }

        const task = { text: taskText, completed: false };
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);

        saveTasks();
        taskInput.value = '';
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
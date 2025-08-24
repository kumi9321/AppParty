document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');

    // タスクを追加する関数
    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            return; // 入力が空の場合は何もしない
        }

        const li = document.createElement('li');
        li.className = 'list-group-item';

        const span = document.createElement('span');
        span.textContent = taskText;
        span.addEventListener('click', () => {
            li.classList.toggle('completed');
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(li);
        });

        li.appendChild(span);
        li.appendChild(deleteButton);
        taskList.appendChild(li);

        taskInput.value = '';
        taskInput.focus();
    };

    // 追加ボタンのクリックイベント
    addButton.addEventListener('click', addTask);

    // Enterキーでもタスクを追加
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

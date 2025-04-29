document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-task');
    const todoList = document.getElementById('todo-list');

    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            
            // Create checkbox div
            const checkbox = document.createElement('div');
            checkbox.className = `checkbox ${todo.completed ? 'checked' : ''}`;
            
            // Create todo text div
            const todoText = document.createElement('div');
            todoText.className = `todo-text ${todo.completed ? 'completed' : ''}`;
            todoText.textContent = todo.text;

            // Create actions div
            const actions = document.createElement('div');
            actions.className = 'todo-actions';
            actions.innerHTML = `
                <button class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            // Add event listeners
            checkbox.addEventListener('click', () => toggleTodo(index));
            
            actions.querySelector('.edit-btn').addEventListener('click', () => editTodo(index));
            actions.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(index));

            // Append elements
            li.appendChild(checkbox);
            li.appendChild(todoText);
            li.appendChild(actions);
            todoList.appendChild(li);
        });
    }

    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        
        // Add animation class
        const checkbox = todoList.children[index].querySelector('.checkbox');
        checkbox.classList.toggle('checked');
        
        const todoText = todoList.children[index].querySelector('.todo-text');
        todoText.classList.toggle('completed');
        
        saveTodos();
    }

    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({
                text,
                completed: false,
                id: Date.now() // Add unique ID for better tracking
            });
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    }

    function editTodo(index) {
        const todoText = todos[index].text;
        const newText = prompt('Edit task:', todoText);
        if (newText !== null && newText.trim() !== '') {
            todos[index].text = newText.trim();
            saveTodos();
            renderTodos();
        }
    }

    function deleteTodo(index) {
        const todoItem = todoList.children[index];
        todoItem.style.transform = 'translateX(-100%)';
        todoItem.style.opacity = '0';
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        }, 300);
    }

    // Event Listeners
    addButton.addEventListener('click', addTodo);
    
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Initialize
    renderTodos();
});
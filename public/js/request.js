const statusCodes = {
  'OK': 200,
  'REDIRECT': 302,
  'UNAUTHORIZED': 401
};

const sendXHR = function(method, url, message, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (this.status === statusCodes.OK) {
      callback(this.responseText);
    }
    if (this.status === statusCodes.UNAUTHORIZED) {
      window.location.href =
        window.location.href.split('/')[0] + 'login';
    }
  };
  xhr.send(message);
};

const createTodo = function() {
  const textBox = event.target.previousElementSibling;
  const message = `title=${textBox.value}`;
  textBox.value && sendXHR('POST', '/createTodo', message, text => {
    generateTodoLists(text);
    selector('.todoList').scrollHeight = selector('.todoList').scrollTop;
  });
  textBox.value = '';
};

const deleteTodo = function() {
  const todo = event.target.closest('.todo-container');
  sendXHR('POST', '/removeTodo', `id=${todo.id}`, generateTodoLists);
};

const addSubTask = function() {
  const textBox = event.target.previousElementSibling;
  const todo = event.target.closest('.todo-container');
  const message = `id=${todo.id}&work=${textBox.value}`;
  textBox.value && sendXHR('POST', '/createTask', message, generateTodoLists);
  textBox.value = '';
};

const removeSubTask = function() {
  const task = event.target.closest('.task-item');
  const [, todoId, taskId] = task.id.split('-');
  const message = `todoId=${todoId}&taskId=${taskId}`;
  sendXHR('POST', '/removeTask', message, generateTodoLists);
};

const changeStatus = () => {
  const task = event.target.closest('.task-item');
  const [, todoId, taskId] = task.id.split('-');
  const message = `todoId=${todoId}&taskId=${taskId}`;
  sendXHR('POST', '/changeStatus', message, generateTodoLists);
};

const renameTodo = function() {
  const todo = event.target.closest('.todo-container');
  event.target.contentEditable = false;
  const newTitle = event.target.innerText;
  const message = `newTitle=${newTitle}&todoId=${todo.id}`;
  sendXHR('POST', '/renameTodo', message, generateTodoLists);
};

const renameTask = function() {
  const task = event.target.closest('.task-item');
  event.target.contentEditable = false;
  const newTitle = event.target.innerText;
  const [, todoId, taskId] = task.id.split('-');
  const message = `newTitle=${newTitle}&todoId=${todoId}&taskId=${taskId}`;
  sendXHR('POST', '/renameTask', message, generateTodoLists);
};

const signOut = function() {
  sendXHR('POST', '/logout', '', function(text) {
    window.location.href = '/login';
  });
};

const loadTasks = function() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/tasks');
  xhr.onload = function() {
    if (this.status === statusCodes.OK) {
      generateTodoLists(this.responseText);
    }
    if (this.status === statusCodes.UNAUTHORIZED) {
      window.location.href =
        window.location.href.split('/')[0] + 'login';
    }
  };
  xhr.send();
};

window.onload = loadTasks;

const statusCodes = {
  'OK': 200
};

const sendXHR = function(method, url, message, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (this.status === statusCodes.OK) {
      callback(this.responseText);
    }
  };
  xhr.open(method, url);
  xhr.send(message);
};

const createTodo = function() {
  const textBox = event.target.previousElementSibling;
  const message = `title=${textBox.value}`;
  textBox.value && sendXHR('POST', '/createTodo', message, generateTodoLists);
  textBox.value = '';
};

const deleteTodo = function() {
  const [, , , task] = event.path;
  const taskId = task.id;
  sendXHR('POST', '/removeTodo', `id=${taskId}`, generateTodoLists);
};

const addSubTask = function() {
  const textBox = event.target.previousElementSibling;
  const [, , , list] = event.path;
  const message = `id=${list.id}&work=${textBox.value}`;
  textBox.value && sendXHR('POST', '/createTask', message, generateTodoLists);
  textBox.value = '';
};

const removeSubTask = function() {
  const [, task, , , todo] = event.path;
  const message = `todoId=${todo.id}&taskId=${task.id.split('-').pop()}`;
  sendXHR('POST', '/removeTask', message, generateTodoLists);
};

const changeStatus = () => {
  const [, , task, , , todo] = event.path;
  const message = `todoId=${todo.id}&taskId=${task.id.split('-').pop()}`;
  sendXHR('POST', '/changeStatus', message, generateTodoLists);
};

const renameTodo = function() {
  const [, , todo] = event.path;
  event.target.contentEditable = false;
  const newTitle = event.target.innerText;
  const message = `newTitle=${newTitle}&todoId=${todo.id}`;
  sendXHR('POST', '/renameTodo', message, generateTodoLists);
};

const renameTask = function() {
  const [, , task, , , todo] = event.path;
  event.target.contentEditable = false;
  const newTitle = event.target.innerText;
  const message = `newTitle=${newTitle}&todoId=${todo.id}&taskId=${task.id.split('-').pop()}`;
  sendXHR('POST', '/renameTask', message, generateTodoLists);
};

const loadTasks = function() {
  sendXHR('GET', '/tasks', '', generateTodoLists);
};

window.onload = loadTasks;

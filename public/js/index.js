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
  textBox.value && sendXHR('POST', '/createTodo', message, generateTasks);
  textBox.value = '';
};

const deleteTodo = function() {
  const [, , , task] = event.path;
  const taskId = task.id;
  sendXHR('POST', '/removeTodo', `id=${taskId}`, generateTasks);
};

const addSubTask = function() {
  const textBox = event.target.previousElementSibling;
  const [, , , list] = event.path;
  const message = `id=${list.id}&work=${textBox.value}`;
  textBox.value && sendXHR('POST', '/createTask', message, generateTasks);
  textBox.value = '';
};

const removeSubTask = function() {
  const [, task, , , todo] = event.path;
  const message = `todoId=${todo.id}&taskId=${task.id}`;
  sendXHR('POST', '/removeTask', message, generateTasks);
};

const changeStatus = () => {
  const [, , task, , , todo] = event.path;
  const message = `todoId=${todo.id}&taskId=${task.id}`;
  sendXHR('POST', '/changeStatus', message, generateTasks);
};

const createImg = function(src, className, eventListener) {
  return `<img src="${src}" class="${className}" 
  onclick="${eventListener}()"></img>`;
};

const renameTodo = function() {
  const [, , todo] = event.path;
  event.target.contentEditable = false;
  const newTitle = event.target.innerText;
  const message = `newTitle=${newTitle}&todoId=${todo.id}`;
  sendXHR('POST', '/renameTodo', message, generateTasks);
};

const createTaskHeader = function(task) {
  const deleteImg = createImg('svg/delete.svg', 'deleteButton', 'deleteTodo');
  const taskHeader = `<div class="todo-header">
  <h3 class="todo-title" onclick="makeContentEditable(renameTodo)" >${task.title}</h3>
  <div class="options">${deleteImg}</div>
  </div>`;
  return taskHeader;
};

const createSubTaskAdder = function() {
  const addButton = createImg('svg/add.svg', 'addButton', 'addSubTask');
  const subTaskAdder = `<div class="subTaskAdder">
    <input type = "text" name = "subTask" 
    placeholder="Enter Enter task here" class="subTask">${addButton}
  </div>`;
  return subTaskAdder;
};

const renameTask = function() {
  const [, , task, , , todo] = event.path;
  event.target.contentEditable = false;
  const newTitle = event.target.innerText;
  const message = `newTitle=${newTitle}&todoId=${todo.id}&taskId=${task.id}`;
  sendXHR('POST', '/renameTask', message, generateTasks);
};

const makeContentEditable = function(callback) {
  event.target.contentEditable = true;
  event.target.focus();
  event.target.onblur = callback;
};

const generateSubTasks = (allTasksHtml, task) => {
  const { id, work, isDone } = task;
  const img = createImg('svg/remove.svg', 'removeButton', 'removeSubTask');
  const html = `<input type="checkbox" onclick="changeStatus()" 
  ${isDone ? 'checked' : ''}><p onclick="makeContentEditable(renameTask)">${work}</p>`;
  const taskHtml = `<div id="${id}" class="task-item">
    <div class="taskStatus">${html}</div>${img}
    </div>`;
  return allTasksHtml + taskHtml;
};

const createSubTasksContainer = function(task) {
  return `<div>${createSubTaskAdder()}
   <div class="tasks">${task.tasks.reduce(generateSubTasks, '')}</div>
   </div>`;
};

const createTodoLists = function(todoList, task) {
  const taskContainer = `<div id="${task.id}" class="todo-container">
  ${createTaskHeader(task)}${createSubTasksContainer(task)}
  </div>`;
  return todoList + taskContainer;
};

const generateTodoLists = function(todoListsJson) {
  const todoListsContainer = document.querySelector('.todoLists');
  const todoLists = todoListsJson.reduce(createTodoLists, '');
  todoListsContainer.innerHTML = todoLists;
};

const generateTasks = function(text) {
  const todoListsJson = JSON.parse(text);
  generateTodoLists(todoListsJson);
};

const loadTasks = function() {
  sendXHR('GET', '/tasks', '', generateTasks);
};

window.onload = loadTasks;

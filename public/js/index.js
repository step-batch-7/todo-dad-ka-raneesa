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
  sendXHR('POST', '/createTodo', `title=${textBox.value}`, generateTasks);
  textBox.value = '';
};

const deleteTask = function(event) {
  const [, , task] = event.path;
  const taskId = task.id;
  sendXHR('POST', '/removeTodo', `id=${taskId}`, generateTasks);
};

const addSubTask = function() {};

const createTaskHeader = function(task) {
  const img = createImg('svg/delete.svg', 'svg', 'deleteTask');
  const taskHeader = `<div class="task-header">
  <h3 class="task-title">${task.title}</h3>${img}
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

const createSubTasksContainer = function(task) {
  return `<div>${createSubTaskAdder()}</div>`;
};

const createTodoLists = function(todoList, task) {
  const taskContainer = `<div id="${task.id}" class="task-container">
  ${createTaskHeader(task)}${createSubTasksContainer(task)}
  </div>`;
  return todoList + taskContainer;
};

const generateTodoLists = function(todoListsJson) {
  const todoListsContainer = document.querySelector('.todoLists');
  const todoLists = todoListsJson.reduce(createTodoLists, '');
  todoListsContainer.innerHTML = todoLists;
};

const displayTodoList = function(event) {
  const [task] = event.path;
  const taskId = task.id;
  const returnButton = createImg('svg/return.svg', 'svg', 'loadTasks');
  sendXHR('GET', '/tasks', '', text => {
    const todoListsContainer = document.querySelector('.todoLists');
    const todoListsJson = JSON.parse(text);
    todoListsContainer.innerHTML = '';
    const [todo] = todoListsJson.filter(task => task.id === +taskId);
    const list = createTodoLists('', todo);
    todoListsContainer.innerHTML = returnButton + list;
  });
};

const createTitles = function(titlesList, task) {
  const title = `<div id="${task.id}" class="todo-title" 
  onclick="displayTodoList(event)">${task.title}</div>`;
  return titlesList + title;
};

const generateTodoTitles = function(todoListsJson) {
  const todoTitlesContainer = document.querySelector('.todoListDisplay');
  const titlesList = todoListsJson.reduce(createTitles, '');
  todoTitlesContainer.innerHTML = `<h1>List:</h1>${titlesList}`;
};

const generateTasks = function(text) {
  const todoListsJson = JSON.parse(text);
  generateTodoLists(todoListsJson);
  generateTodoTitles(todoListsJson);
};

const createImg = function(src, className, eventListener) {
  return `<img src="${src}" class="${className}" 
  onclick="${eventListener}(event)"></img>`;
};

const loadTasks = function() {
  sendXHR('GET', '/tasks', '', generateTasks);
};

window.onload = loadTasks;

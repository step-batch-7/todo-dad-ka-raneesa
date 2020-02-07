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

const deleteTodo = function(event) {
  const [, , task] = event.path;
  const taskId = task.id;
  sendXHR('POST', '/removeTodo', `id=${taskId}`, generateTasks);
};

const addSubTask = function(event) {
  const textBox = event.target.previousElementSibling;
  const [, , , list] = event.path;
  const message = `id=${list.id}&work=${textBox.value}`;
  textBox.value && sendXHR('POST', '/createTask', message, generateTasks);
  textBox.value = '';
};

const removeSubTask = function(event) {
  const [, taskItem, , , list] = event.path;
  const message = `taskId=${taskItem.id}&listId=${list.id}`;
  sendXHR('POST', '/removeTask', message, generateTasks);
};

const completeTask = event => {
  const [, , taskItem, , , list] = event.path;
  const message = `taskId=${taskItem.id}&listId=${list.id}`;
  sendXHR('POST', '/completeTask', message, generateTasks);
};

const createImg = function(src, className, eventListener) {
  return `<img src="${src}" class="${className}" 
  onclick="${eventListener}(event)"></img>`;
};

const createTaskHeader = function(task) {
  const img = createImg('svg/delete.svg', 'svg', 'deleteTodo');
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

const generateSubTasks = (allTasksHtml, task) => {
  const { id, work, isDone } = task;
  const img = createImg('svg/remove.svg', 'removeButton', 'removeSubTask');
  let html = `<input type="checkbox" onclick="completeTask(event)">${work}`;
  if (isDone) {
    html = `<input type="checkbox" onclick="completeTask(event)" checked>
     <strike>${work}</strike>`;
  }
  const taskHtml = `<div id="${id}" class="task-item">
    <p>${html}</p>${img}
    </div>`;
  return allTasksHtml + taskHtml;
};

const createSubTasksContainer = function(task) {
  return `<div>${createSubTaskAdder()}
   <div class="tasks">${task.tasks.reduce(generateSubTasks, '')}</div>
   </div>`;
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

const loadTasks = function() {
  sendXHR('GET', '/tasks', '', generateTasks);
};

window.onload = loadTasks;

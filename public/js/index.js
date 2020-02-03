const getTodoAdder = () => document.querySelector('.todoAdder');
const getTodoListDisplay = () => document.querySelector('.todoListDisplay');

const statusCodes = {
  'OK': 200
};

const addHeader = function() {
  const todoAdder = getTodoAdder();
  const header = document.createElement('h1');
  header.textContent = 'Create New Todo List';
  todoAdder.appendChild(header);
};

const addTitleBox = function() {
  const titleBox = document.createElement('input');
  titleBox.setAttribute('type', 'text');
  titleBox.setAttribute('name', 'title');
  titleBox.setAttribute('placeholder', 'Enter Todo Title');
  titleBox.id = 'title';
  return titleBox;
};

const addSubmitButton = function() {
  const submitButton = document.createElement('input');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('value', 'create');
  return submitButton;
};

const createForm = function() {
  const todoAdder = getTodoAdder();
  const form = document.createElement('form');
  form.id = 'createTaskBar';
  form.setAttribute('action', 'createTodo');
  form.setAttribute('method', 'POST');
  form.appendChild(addTitleBox());
  form.appendChild(addSubmitButton());
  todoAdder.appendChild(form);
};

const addHeaderToDisplay = function() {
  const todoAdder = getTodoListDisplay();
  const header = document.createElement('h1');
  header.textContent = 'List:';
  todoAdder.appendChild(header);
};

const setupTodoAdder = function() {
  addHeader();
  createForm();
};

const postHttpMsg = function(url, callback, message) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (this.status === statusCodes.OK) {
      callback(this.responseText);
    }
  };
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(message);
};

const createTaskHeader = function(task) {
  const taskHeader = document.createElement('div');
  const taskTitle = document.createElement('h3');
  const img = createImg('svg/delete.svg', 'svg', deleteTask);
  taskTitle.classList.add('task-title');
  taskTitle.textContent = task.title;
  taskHeader.classList.add('task-header');
  taskHeader.appendChild(taskTitle);
  taskHeader.appendChild(img);
  return taskHeader;
};

const createTodoLists = function(task) {
  const taskContainer = document.createElement('div');
  const taskHeader = createTaskHeader(task);
  taskContainer.id = task.id;
  taskContainer.classList.add('task-container');
  taskContainer.appendChild(taskHeader);
  return taskContainer;
};

const createTitles = function(task) {
  const title = document.createElement('a');
  title.setAttribute('href', `#${task.id}`);
  title.textContent = task.title;
  return title;
};

const generateTasks = function(text) {
  const todoListsContainer = document.querySelector('.todoLists');
  const todoTitlesContainer = document.querySelector('.todoListDisplay');
  const todoListsJson = JSON.parse(text);
  const todoLists = todoListsJson.map(createTodoLists);
  const todoTitles = todoListsJson.map(createTitles);
  todoListsContainer.innerHTML = '';
  todoTitlesContainer.innerHTML = '';
  todoLists.forEach(task => todoListsContainer.appendChild(task));
  todoTitles.forEach(title => {
    const breakTag = document.createElement('br');
    todoTitlesContainer.appendChild(title);
    todoTitlesContainer.appendChild(breakTag);
  });
};

const deleteTask = function(event) {
  const [, , task] = event.path;
  const taskId = task.id;
  postHttpMsg('/removeTodo', generateTasks, `id=${taskId}`);
};

const createImg = function(src, className, eventListener) {
  const img = document.createElement('img');
  img.setAttribute('src', src);
  img.classList.add(className);
  img.addEventListener('click', eventListener);
  return img;
};

const sendHttpGet = function(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (this.status === statusCodes.OK) {
      callback(this.responseText);
    }
  };
  xhr.open('GET', url);
  xhr.send();
};

const loadTasks = function() {
  sendHttpGet('/tasks', generateTasks);
};

const main = function() {
  setupTodoAdder();
  addHeaderToDisplay();
  loadTasks();
};

window.onload = main;

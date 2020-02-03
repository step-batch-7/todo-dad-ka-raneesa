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

const deleteTask = function(event) {
};

const createImg = function(src, className, eventListener) {
  const img = document.createElement('img');
  img.setAttribute('src', src);
  img.classList.add(className);
  img.addEventListener('click', eventListener);
  return img;
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

const createTodoLists = function(task) {
  const taskContainer = document.createElement('div');
  const taskHeader = createTaskHeader(task);
  taskContainer.id = task.id;
  taskContainer.classList.add('task-container');
  taskContainer.appendChild(taskHeader);
  return taskContainer;
};

const loadTasks = function() {
  sendHttpGet('/tasks', text => {
    const todoListsContainer = document.querySelector('.todoLists');
    const todoListsJson = JSON.parse(text);
    const todoLists = todoListsJson.map(createTodoLists);
    todoLists.forEach(task => todoListsContainer.appendChild(task));
  });
};

const main = function() {
  setupTodoAdder();
  addHeaderToDisplay();
  loadTasks();
};

window.onload = main;

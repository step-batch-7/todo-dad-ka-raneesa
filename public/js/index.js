const statusCodes = {
  'OK': 200
};

const addHeaderToDisplay = function() {
  const todoAdder = document.querySelector('.todoListDisplay');
  const header = document.createElement('h1');
  header.textContent = 'List:';
  todoAdder.appendChild(header);
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

const createTodoList = function() {
  const textBox = event.target.previousElementSibling;
  postHttpMsg('/createTodo', generateTasks, `title=${textBox.value}`);
  textBox.value = '';
};

const createSubTaskTextBox = function() {
  const subTaskBox = document.createElement('input');
  subTaskBox.setAttribute('type', 'text');
  subTaskBox.setAttribute('name', 'subTask');
  subTaskBox.setAttribute('placeholder', 'Enter task here');
  subTaskBox.id = 'subTask';
  return subTaskBox;
};

const addSubTask = function() {
};

const createSubTaskAdder = function() {
  const subTaskAdder = document.createElement('div');
  const textBox = createSubTaskTextBox();
  const addButton = createImg('svg/add.svg', 'addButton', addSubTask);
  subTaskAdder.classList.add('subTaskAdder');
  subTaskAdder.appendChild(textBox);
  subTaskAdder.appendChild(addButton);
  return subTaskAdder;
};

const createSubTasksContainer = function(task) {
  const tasksContainer = document.createElement('div');
  tasksContainer.appendChild(createSubTaskAdder());
  return tasksContainer;
};

const createTodoLists = function(task) {
  const taskContainer = document.createElement('div');
  taskContainer.id = task.id;
  taskContainer.classList.add('task-container');
  taskContainer.appendChild(createTaskHeader(task));
  taskContainer.appendChild(createSubTasksContainer(task));
  return taskContainer;
};

const displayTodoList = function(event) {
  const [task] = event.path;
  const taskId = task.id;
  const returnButton = createImg('svg/return.svg', 'svg', loadTasks);
  sendHttpGet('/tasks', text => {
    const todoListsContainer = document.querySelector('.todoLists');
    const todoListsJson = JSON.parse(text);
    todoListsContainer.innerHTML = '';
    const [todo] = todoListsJson.filter(task => task.id === +taskId);
    const list = createTodoLists(todo);
    todoListsContainer.appendChild(returnButton);
    todoListsContainer.appendChild(list);
  });
};

const createTitles = function(task) {
  const title = document.createElement('div');
  title.id = task.id;
  title.textContent = task.title;
  title.classList.add('todo-title');
  title.addEventListener('click', displayTodoList);
  return title;
};

const generateTodoLists = function(todoListsJson) {
  const todoListsContainer = document.querySelector('.todoLists');
  todoListsContainer.innerHTML = '';
  const todoLists = todoListsJson.map(createTodoLists);
  todoLists.forEach(task => todoListsContainer.appendChild(task));
};

const generateTodoTitles = function(todoListsJson) {
  const todoTitlesContainer = document.querySelector('.todoListDisplay');
  const todoTitles = todoListsJson.map(createTitles);
  todoTitlesContainer.innerHTML = '';
  addHeaderToDisplay();
  todoTitles.forEach(title => {
    const breakTag = document.createElement('br');
    todoTitlesContainer.appendChild(title);
    todoTitlesContainer.appendChild(breakTag);
  });
};

const generateTasks = function(text) {
  const todoListsJson = JSON.parse(text);
  generateTodoLists(todoListsJson);
  generateTodoTitles(todoListsJson);
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

window.onload = loadTasks;

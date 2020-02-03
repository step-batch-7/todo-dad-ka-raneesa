const getTodoAdder = () => document.querySelector('.todoAdder');

const addHeader = function() {
  const todoAdder = getTodoAdder();
  const header = document.createElement('h1');
  header.textContent = 'Create New Todo List';
  todoAdder.appendChild(header);
};

const addTitleBox = function() {
  const todoAdder = getTodoAdder();
  const titleBox = document.createElement('input');
  titleBox.setAttribute('placeholder', 'Enter Todo Title');
  titleBox.id = 'title';
  todoAdder.appendChild(titleBox);
};

const addSubmitButton = function() {
  const todoAdder = getTodoAdder();
  const submitButton = document.createElement('input');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('value', 'create');
  todoAdder.appendChild(submitButton);
};

const setupTodoAdder = function() {
  addHeader();
  addTitleBox();
  addSubmitButton();
};

const main = function() {
  setupTodoAdder();
};

window.onload = main;

const getTodoAdder = () => document.querySelector('.todoAdder');

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

const setupTodoAdder = function() {
  addHeader();
  createForm();
};

const main = function() {
  setupTodoAdder();
};

window.onload = main;

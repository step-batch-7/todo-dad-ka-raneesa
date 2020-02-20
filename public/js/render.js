const createImg = function(src, className, eventListener) {
  return `<img src="${src}" class="${className}" 
  onclick="${eventListener}()"></img>`;
};

const createTaskHeader = function(task) {
  const deleteImg = createImg('svg/delete.svg', 'deleteButton', 'deleteTodo');
  const taskHeader = `<div class="todo-header">
  <h3 class="todo-title" onclick="makeContentEditable(renameTodo)" >
  ${task.title}</h3>
  <div class="options">${deleteImg}</div>
  </div>`;
  return taskHeader;
};

const createSubTaskAdder = function(date) {
  const addButton = createImg('svg/add.svg', 'addButton', 'addSubTask');
  const subTaskAdder = `<div class="subTaskAdder">
    <input type="text" name="subTask" onkeypress="addListener()"
    placeholder="Add new task here..." class="subTask">${addButton} 
    <span id="date">Created On: ${date} </span>
  </div>`;
  return subTaskAdder;
};

const makeContentEditable = function(callback) {
  event.target.contentEditable = true;
  event.target.focus();
  event.target.onblur = callback;
};

const generateSubTasks = (allTasksHtml, task, todoId) => {
  const { id, work, isDone } = task;
  const img = createImg('svg/remove.svg', 'removeButton', 'removeSubTask');

  const html = `<input type="checkbox" onclick="changeStatus()" 
  ${isDone ? 'checked' : ''}>
  <p onclick="makeContentEditable(renameTask)"
   class=${isDone ? 'done' : ''}>${work}</p>`;

  const taskHtml = `<div id="task-${todoId}-${id}" class="task-item">
    <div class="taskStatus">${html}</div>${img}
    </div>`;
  return allTasksHtml + taskHtml;
};

const createSubTasksContainer = function(todo) {
  return `<div>${createSubTaskAdder(todo.date)}
   <div class="tasks">${todo.tasks.reduce((html, task) => {
    return generateSubTasks(html, task, todo.id);
  }, '')}</div></div>`;
};

const createTodoLists = function(todoList, todo) {
  const taskContainer = `<div id="${todo.id}" class="todo-container">
  ${createTaskHeader(todo)}${createSubTasksContainer(todo)}
  </div>`;
  return todoList + taskContainer;
};

const generateTodoLists = function(text) {
  const todoList = JSON.parse(text);
  const todoListsContainer = document.querySelector('.todoList');
  const todoListsHtml = todoList.reduce(createTodoLists, '');
  todoListsContainer.innerHTML = todoListsHtml;
};

const addListener = function() {
  if (event.key === 'Enter') {
    event.target.nextElementSibling.click();
  }
};

const showInstruction = function() {
  selector('.container').style.filter = 'blur(4px)';
  selector('#show').style.display = 'block';
};

const hideInstruction = function() {
  selector('#show').style.display = 'none';
  selector('.container').style.filter = 'blur(0px)';
};

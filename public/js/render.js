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

const createSubTaskAdder = function() {
  const addButton = createImg('svg/add.svg', 'addButton', 'addSubTask');
  const subTaskAdder = `<div class="subTaskAdder">
    <input type="text" name="subTask" onchange="addListener()"
    placeholder="Add new task here..." class="subTask">${addButton}
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
  return `<div>${createSubTaskAdder()}
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
  event.target.nextElementSibling.click();
};

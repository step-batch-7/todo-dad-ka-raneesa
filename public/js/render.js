
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
    <input type = "text" name = "subTask" 
    placeholder="Enter Enter task here" class="subTask">${addButton}
  </div>`;
  return subTaskAdder;
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
  ${isDone ? 'checked' : ''}>
  <p onclick="makeContentEditable(renameTask)"
   class=${isDone ? 'done' : ''}>${work}</p>`;
  const taskHtml = `<div id="task-${id}" class="task-item">
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

const generateTodoLists = function(text) {
  const todoListsJson = JSON.parse(text);
  const todoListsContainer = document.querySelector('.todoList');
  const todoLists = todoListsJson.reduce(createTodoLists, '');
  todoListsContainer.innerHTML = todoLists;
};

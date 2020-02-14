const selector = function(element) {
  return document.querySelector(element);
};

const todoSearch = function(todoList) {
  const searchText = document.querySelector('#todoSearch').value;
  todoList.forEach(todo => {
    if (todo.title.toLowerCase().includes(searchText.toLowerCase())) {
      document.getElementById(todo.id).style.display = '';
    } else {
      document.getElementById(todo.id).style.display = 'none';
    }
  });
};

const filterTasks = function(todo, searchText) {
  if (!searchText.trim()) {
    return [];
  }
  return todo.tasks.filter(task => {
    return task.work.toLowerCase().includes(searchText.toLowerCase());
  });
};

const unHighlightText = function(todo, tasks) {
  tasks.forEach(task => {
    const text = selector(`[id='${todo.id}'] #task-${todo.id}-${task.id} p`);
    text.classList.remove('selected');
  });
};

const highlightMatchedTasks = function(todoId, tasks) {
  tasks.forEach(task => {
    const text = selector(`[id='${todoId}'] #task-${todoId}-${task.id} p`);
    text.classList.add('selected');
  });
};

const taskSearch = function(todoList) {
  const searchText = selector('#taskSearch').value;
  todoList.forEach(todo => {
    unHighlightText(todo, todo.tasks);
    const matchedTasks = filterTasks(todo, searchText);
    highlightMatchedTasks(todo.id, matchedTasks);
    if (matchedTasks.length || !searchText) {
      document.getElementById(todo.id).style.display = '';
    } else {
      document.getElementById(todo.id).style.display = 'none';
    }
  });
};

const clearSearchBar = function(event) {
  if (event.target.id === 'todoSearch') {
    selector('#taskSearch').value = '';
  } else {
    selector('#todoSearch').value = '';
  }
};

const initiateSearch = function(filter) {
  clearSearchBar(event);
  const searchBar = event.target;
  sendXHR('GET', '/tasks', '', function(text) {
    const todoList = JSON.parse(text);
    todoSearch(todoList);
    searchBar.oninput = filter.bind(null, todoList);
  });
};

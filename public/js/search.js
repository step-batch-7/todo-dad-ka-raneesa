const todoSearch = function(todoList) {
  const searchText = document.querySelector('#todoSearch').value;
  todoList.forEach(todo => {
    if (todo.title.includes(searchText)) {
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
  return todo.tasks.filter(task => task.work.includes(searchText));
};

const unHighlightText = function(todo, tasks) {
  tasks.forEach(task => {
    const text = document.querySelector(`[id='${todo.id}'] #task-${task.id} p`);
    text.classList.remove('selected');
  });
};

const highlightMatchedTasks = function(todoId, tasks) {
  tasks.forEach(task => {
    const text = document.querySelector(`[id='${todoId}'] #task-${task.id} p`);
    text.classList.add('selected');
  });
};

const taskSearch = function(todoList) {
  const searchText = document.querySelector('#taskSearch').value;
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
    document.querySelector('#taskSearch').value = '';
  } else {
    document.querySelector('#todoSearch').value = '';
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

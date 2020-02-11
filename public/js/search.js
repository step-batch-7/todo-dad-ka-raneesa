const todoSearch = function(todoList) {
  const searchText = event.target.value;
  todoList.forEach(todo => {
    if (todo.title.includes(searchText)) {
      document.getElementById(todo.id).style.display = '';
    } else {
      document.getElementById(todo.id).style.display = 'none';
    }
  });
};

const initiateSearch = function() {
  const todoDiv = Array.from(document.querySelector('.todoList').children);
  const todoList = todoDiv.map((todo) => {
    return {
      id: todo.id,
      title: todo.firstElementChild.firstElementChild.innerText
    };
  });
  event.target.oninput = todoSearch.bind(null, todoList);
};

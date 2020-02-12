const fs = require('fs');
const TodoList = require('./TodoList');
const TODO_STORE = process.env.DATA_STORE;

const readFile = function(path) {
  return fs.readFileSync(path, 'utf8');
};

const writeTodoLists = function(data) {
  return fs.writeFileSync(TODO_STORE, data, 'utf8');
};

const isFileNotPresent = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const loadTodoLists = function() {
  if (isFileNotPresent(TODO_STORE)) {
    return [];
  }
  const list = JSON.parse(readFile(TODO_STORE) || '[]');
  return new TodoList(list);
};

module.exports = {
  readFile,
  writeTodoLists,
  isFileNotPresent,
  loadTodoLists
};

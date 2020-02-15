const fs = require('fs');
const TODO_STORE = process.env.DATA_STORE;

const readFile = function(path, encoding) {
  return fs.readFileSync(path, encoding);
};

const writeFile = function(path, data) {
  return fs.writeFileSync(path, data, 'utf8');
};

const writeTodoLists = function(data) {
  return fs.writeFileSync(TODO_STORE, data, 'utf8');
};

const isFileNotPresent = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const loadTodoListFromFile = function() {
  if (isFileNotPresent(TODO_STORE)) {
    return [];
  }
  return JSON.parse(readFile(TODO_STORE, 'utf8') || '{}');
};

module.exports = {
  readFile,
  writeFile,
  writeTodoLists,
  isFileNotPresent,
  loadTodoListFromFile
};

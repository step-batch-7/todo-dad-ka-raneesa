const fs = require('fs');
const path = require('./config').todoLists;

const readFile = function(path, encoding) {
  if (isFileNotPresent(path)) {
    return '[]';
  }
  return fs.readFileSync(path, encoding);
};

const writeFile = function(path, data) {
  return fs.writeFileSync(path, data, 'utf8');
};

const writeTodoLists = function(data) {
  return fs.writeFileSync(path, data, 'utf8');
};

const isFileNotPresent = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const loadTodoListFromFile = function(path) {
  if (isFileNotPresent(path)) {
    return {};
  }
  return JSON.parse(readFile(path, 'utf8') || '{}');
};

module.exports = {
  readFile,
  writeFile,
  writeTodoLists,
  isFileNotPresent,
  loadTodoListFromFile
};

'use strict';

const express = require('express');
const app = express();
const { readFile } = require('./lib/io');
const {
  methodAllowed, serveTodoLists, isValidRequest, signUp,
  createTodoList, removeTodoList, addTask, removeTask,
  changeStatusOfTask, renameTodo, renameTask, serveNotFoundPage
} = require('./lib/handlers');

const usersDetails = JSON.parse(readFile('./data/usersDetails.json', 'utf8'));
app.locals.usersDetails = usersDetails;

const defaultPort = 4000;

app.listen(defaultPort, () => {
  process.stdout.write(`Listening at port ${defaultPort}`);
});

app.use(express.urlencoded({ extended: true }));
app.use(methodAllowed);
app.use(express.static('public'));
app.get('/tasks', serveTodoLists);
app.post('/signup', isValidRequest('name', 'username', 'email', 'password'),
  signUp);
app.post('/createTodo', isValidRequest('title'), createTodoList);
app.post('/removeTodo', isValidRequest('id'), removeTodoList);
app.post('/createTask', isValidRequest('id', 'work'), addTask);
app.post('/removeTask', isValidRequest('todoId', 'taskId'), removeTask);
app.post('/changeStatus', isValidRequest('todoId', 'taskId'),
  changeStatusOfTask);
app.post('/renameTodo', isValidRequest('newTitle', 'todoId'), renameTodo);
app.post('/renameTask', isValidRequest('newTitle', 'todoId', 'taskId'),
  renameTask);
app.post('', serveNotFoundPage);

module.exports = app;

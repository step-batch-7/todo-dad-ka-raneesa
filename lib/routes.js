'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const TodoList = require('./TodoList');
const { readFile, loadTodoListFromFile } = require('./io');
const {
  methodAllowed, serveTodoLists, isValidRequest, signUp,
  createTodoList, removeTodoList, addTask, removeTask,
  changeStatusOfTask, renameTodo, renameTask, serveNotFoundPage,
  isUserLoggedIn, serveSignUpPage, serveLoginPage, login
} = require('./handlers');

const loadTodoList = function(todoList) {
  const allTodoLists = {};
  for (const user in todoList) {
    allTodoLists[user] = new TodoList(todoList[user].todoList);
  }
  return allTodoLists;
};

const usersDetails = JSON.parse(readFile('./data/usersDetails.json', 'utf8'));
app.locals.usersDetails = usersDetails;
app.locals.sessions = [];
const todoList = loadTodoListFromFile();
app.locals.todoLists = loadTodoList(todoList);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodAllowed);
app.use(express.static('public'));
app.get('/signup', serveSignUpPage);
app.post('/signup', isValidRequest('name', 'username', 'email', 'password'),
  signUp);
app.get('/login', serveLoginPage);
app.post('/login', isValidRequest('username', 'password'), login);
app.use(isUserLoggedIn);
app.get('/tasks', serveTodoLists);
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
'use strict';

const TodoList = require('./TodoList');
const CONTENT_TYPES = require('./mimeTypes');
const {
  writeFile,
  writeTodoLists,
  loadTodoLists
} = require('./io');

const serveNotFoundPage = function(req, res) {
  const html =
    `<html>
    <head>
      <title>Not Found</title>
    </head>
    <body>
      <p>404 File not found</p>
    </body>
    </html>`;
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.setHeader('Content-Length', html.length);
  res.statusCode = 404;
  res.end(html);
};

const serveBadRequestPage = function(req, res) {
  const html =
    `<html>
    <head>
      <title>Bad Request</title>
    </head>
    <body>
      <p>400 Your browser sent a request that this server could not understand.
Bad Request - Inv</p>
    </body>
    </html>`;
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.setHeader('Content-Length', html.length);
  res.statusCode = 400;
  res.end(html);
};

const todoList = new TodoList(loadTodoLists());

const isValidRequest = function(...params) {
  return (req, res, next) => {
    const isValid = params.every(param => {
      return Object.keys(req.body).includes(param);
    });
    if (isValid) {
      return next();
    }
    serveBadRequestPage(req, res);
  };
};

const createTodoList = function(req, res) {
  const { title } = req.body;
  if (todoList.addTodo(title)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const serveTodoLists = function(req, res) {
  writeTodoLists(JSON.stringify(todoList.todoList));
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList.todoList));
};

const removeTodoList = function(req, res) {
  const { id } = req.body;
  if (todoList.removeTodo(id)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const addTask = function(req, res) {
  const { id, work } = req.body;
  if (todoList.addTask(id, work)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const removeTask = function(req, res) {
  const { todoId, taskId } = req.body;
  if (todoList.removeTask(todoId, taskId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const changeStatusOfTask = function(req, res) {
  const { todoId, taskId } = req.body;
  if (todoList.changeStatus(todoId, taskId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const renameTodo = function(req, res) {
  const { newTitle, todoId } = req.body;
  if (todoList.renameTodo(newTitle, todoId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const renameTask = function(req, res) {
  const { newTitle, todoId, taskId } = req.body;
  if (todoList.renameTask(newTitle, todoId, taskId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const doesExistDetails = function(usersDetails, username, email) {
  return usersDetails.reduce((err, details) => {
    if (details.username === username) {
      err.usernameError = 'Username already exists';
    }
    if (details.email === email) {
      err.emailError = 'Email already registered';
    }
    return err;
  }, {});
};

const signUp = function(req, res) {
  const details = req.body;
  const usersDetails = req.app.locals.usersDetails;
  const err = doesExistDetails(usersDetails, details.username, details.email);
  if (!(err.usernameError || err.emailError)) {
    details.regDate = new Date().toLocaleString();
    usersDetails.push(details);
    writeFile('./data/usersDetails.json', JSON.stringify(usersDetails));
  }
  res.statusCode = 200;
  res.end(JSON.stringify(err));
};

const methodAllowed = function(req, res, next) {
  const statusCode = 405;
  const allowedMethods = ['GET', 'POST'];
  if (allowedMethods.includes(req.method)) {
    return next();
  }
  return res.status(statusCode).send('Method Not Allowed');
};

module.exports = {
  methodAllowed, serveTodoLists, isValidRequest, signUp,
  createTodoList, removeTodoList, addTask, removeTask,
  changeStatusOfTask, renameTodo, renameTask, serveNotFoundPage
};

'use strict';

const CONTENT_TYPES = require('./mimeTypes');
const config = require(process.env.APP_CONFIG);
const TodoList = require('./TodoList');
const {
  readFile,
  writeFile,
  writeTodoLists
} = require('./io');
const {
  createSession, isValidUser,
  fillSignUpTemplate
} = require('./utilities');

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
  if (req.todoList[req.username].addTodo(title)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const serveTodoLists = function(req, res) {
  const todoList = req.todoList[req.username].todoList;
  writeTodoLists(JSON.stringify(req.todoList));
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList));
};

const removeTodoList = function(req, res) {
  const { id } = req.body;
  if (req.todoList[req.username].removeTodo(id)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const addTask = function(req, res) {
  const { id, work } = req.body;
  if (req.todoList[req.username].addTask(id, work)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const removeTask = function(req, res) {
  const { todoId, taskId } = req.body;
  if (req.todoList[req.username].removeTask(todoId, taskId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const changeStatusOfTask = function(req, res) {
  const { todoId, taskId } = req.body;
  if (req.todoList[req.username].changeStatus(todoId, taskId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const renameTodo = function(req, res) {
  const { newTitle, todoId } = req.body;
  if (req.todoList[req.username].renameTodo(newTitle, todoId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const renameTask = function(req, res) {
  const { newTitle, todoId, taskId } = req.body;
  const todoLists = req.todoList;
  if (todoLists[req.username].renameTask(newTitle, todoId, taskId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const createNewUser = function(details, usersDetails, todoLists) {
  details.regDate = new Date().toLocaleString();
  usersDetails.push(details);
  writeFile(config.usersDetails, JSON.stringify(usersDetails));
  todoLists[details.username] = new TodoList([]);
  writeFile(config.todoLists, JSON.stringify(todoLists));
};

const signUp = function(req, res) {
  const usersDetails = req.app.locals.usersDetails;
  const details = req.body;
  const [page, err] = fillSignUpTemplate(details, usersDetails);
  if (err) {
    res.setHeader('content-type', 'text/html');
    return res.send(page);
  }
  createNewUser(details, usersDetails, req.app.locals.todoLists);
  res.redirect('/login');
};

const login = function(req, res) {
  const details = req.body;
  if (isValidUser(req.app.locals.usersDetails, details)) {
    const session = createSession(req.app.locals.sessions, details.username);
    req.app.locals.sessions.push(session);
    res.setHeader('Set-Cookie', `SID=${session.SID}`);
    return res.redirect('/');
  }
  let loginPage = readFile('./public/templates/login.html', 'utf8');
  loginPage = loginPage.replace('__error__', 'Invalid Credentials..');
  res.setHeader('content-type', 'text/html');
  return res.send(loginPage);
};

const serveSignUpPage = function(req, res) {
  let signUpPage = readFile('./public/templates/signUp.html', 'utf8');
  signUpPage = signUpPage.replace(/__.*__/g, '');
  res.setHeader('content-type', 'text/html');
  res.send(signUpPage);
};

const serveLoginPage = function(req, res) {
  let loginPage = readFile('./public/templates/login.html', 'utf8');
  loginPage = loginPage.replace(/__.*__/g, '');
  res.setHeader('content-type', 'text/html');
  res.send(loginPage);
};

const methodAllowed = function(req, res, next) {
  process.stdout.write('\n' + req.url);
  const statusCode = 405;
  const allowedMethods = ['GET', 'POST'];
  if (allowedMethods.includes(req.method)) {
    return next();
  }
  return res.status(statusCode).send('Method Not Allowed');
};

const isUserLoggedIn = function(req, res, next) {
  const statusCode = 401;
  const sessionId = req.cookies.SID;
  const session = req.app.locals.sessions.find(session => {
    return session.SID === +sessionId;
  });
  if (session) {
    req.todoList = req.app.locals.todoLists;
    req.username = session.username;
    return next();
  }
  return res.status(statusCode).send();
};

const checkRequestValidity = function(req, res, next) {
  const validRequests = ['/signup', '/login', '/tasks',
    '/createTodo', '/removeTodo', '/logout',
    '/createTask', '/removeTask', '/changeStatus',
    '/renameTodo', 'renameTask'];
  if (validRequests.includes(req.url)) {
    return next();
  }
  serveNotFoundPage(req, res);
};

const logout = function(req, res) {
  const num = 1;
  const sessionId = req.cookies.SID;
  const sessionIndex = req.app.locals.sessions.findIndex(session => {
    return session.SID === +sessionId;
  });
  req.app.locals.sessions.splice(sessionIndex, num);
  res.clearCookie('SID');
  res.redirect('/login');
};

module.exports = {
  methodAllowed, serveTodoLists, signUp, isValidRequest,
  createTodoList, removeTodoList, addTask, removeTask,
  changeStatusOfTask, renameTodo, renameTask, serveNotFoundPage,
  isUserLoggedIn, serveSignUpPage, serveLoginPage, login, logout,
  checkRequestValidity
};

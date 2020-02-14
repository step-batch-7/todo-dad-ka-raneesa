'use strict';

const CONTENT_TYPES = require('./mimeTypes');
const {
  readFile,
  writeFile,
  writeTodoLists
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
  if (req.app.locals.todoLists.addTodo(title)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const serveTodoLists = function(req, res) {
  const todoList = req.app.locals.todoLists.todoList;
  writeTodoLists(JSON.stringify(todoList));
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList));
};

const removeTodoList = function(req, res) {
  const { id } = req.body;
  if (req.app.locals.todoLists.removeTodo(id)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const addTask = function(req, res) {
  const { id, work } = req.body;
  if (req.app.locals.todoLists.addTask(id, work)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const removeTask = function(req, res) {
  const { todoId, taskId } = req.body;
  if (req.app.locals.todoLists.removeTask(todoId, taskId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const changeStatusOfTask = function(req, res) {
  const { todoId, taskId } = req.body;
  if (req.app.locals.todoLists.changeStatus(todoId, taskId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const renameTodo = function(req, res) {
  const { newTitle, todoId } = req.body;
  if (req.app.locals.todoLists.renameTodo(newTitle, todoId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const renameTask = function(req, res) {
  const { newTitle, todoId, taskId } = req.body;
  if (req.app.locals.todoLists.renameTask(newTitle, todoId, taskId)) {
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

const fillSignUpTemplate = function(details, usersDetails) {
  const err = doesExistDetails(usersDetails, details.username, details.email);
  let signUpPage = readFile('./public/templates/signUp.html', 'utf8');
  const usernameError = err.usernameError ? err.usernameError : '';
  const emailError = err.emailError ? err.emailError : '';
  signUpPage = signUpPage.replace('__usernameError__', usernameError);
  signUpPage = signUpPage.replace('__emailError__', emailError);
  signUpPage = signUpPage.replace('__fullName__', details.name);
  signUpPage = signUpPage.replace('__username__', details.username);
  signUpPage = signUpPage.replace('__email__', details.email);
  return [signUpPage, usernameError || emailError];
};

const signUp = function(req, res) {
  const details = req.body;
  const usersDetails = req.app.locals.usersDetails;
  const [page, err] = fillSignUpTemplate(details, usersDetails);
  if (err) {
    res.send(page);
  } else {
    details.regDate = new Date().toLocaleString();
    usersDetails.push(details);
    writeFile('./data/usersDetails.json', JSON.stringify(usersDetails));
    res.redirect('login');
  }
};

const login = function(req, res, next) {
  
};

const serveSignUpPage = function(req, res) {
  let signUpPage = readFile('./public/templates/signUp.html', 'utf8');
  signUpPage = signUpPage.replace(/__.*__/g, '');
  res.send(signUpPage);
};

const serveLoginPage = function(req, res) {
  let loginPage = readFile('./public/templates/login.html', 'utf8');
  loginPage = loginPage.replace(/__.*__/g, '');
  res.send(loginPage);
};

const methodAllowed = function(req, res, next) {
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
    return session.SID === sessionId;
  });
  if (session) {
    req.username = session.username;
    return next();
  }
  res.status(statusCode).send();
};

module.exports = {
  methodAllowed, serveTodoLists, isValidRequest, signUp,
  createTodoList, removeTodoList, addTask, removeTask,
  changeStatusOfTask, renameTodo, renameTask, serveNotFoundPage,
  isUserLoggedIn, serveSignUpPage, serveLoginPage, login
};

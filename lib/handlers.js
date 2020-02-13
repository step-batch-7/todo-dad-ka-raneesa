'use strict';

const queryString = require('querystring');
const App = require('./app');
const TodoList = require('./TodoList');
const CONTENT_TYPES = require('./mimeTypes');
const {
  readFile,
  writeFile,
  writeTodoLists,
  isFileNotPresent,
  loadTodoLists
} = require('./io');

const STATIC_FOLDER = `${__dirname}/../public`;
const DATA_FOLDER = `${STATIC_FOLDER}/../data`;

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = queryString.parse(data);
    next();
  });
};

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

const getRequestedPath = function(reqUrl) {
  const url = reqUrl === '/' ? '/index.html' : reqUrl;
  return `${STATIC_FOLDER}${url}`;
};

const serveStaticFile = function(req, res, next) {
  const path = getRequestedPath(req.url);
  if (isFileNotPresent(path)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const content = readFile(path, '');
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.setHeader('Content-Length', content.length);
  res.end(content);
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

const usersDetails =
  JSON.parse(readFile(`${DATA_FOLDER}/usersDetails.json`, 'utf8'));

const doesExistDetails = function(username, email) {
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
  const err = doesExistDetails(details.username, details.email);
  if (!(err.usernameError || err.emailError)) {
    details.regDate = new Date().toLocaleString();
    usersDetails.push(details);
    writeFile(`${DATA_FOLDER}/usersDetails.json`, JSON.stringify(usersDetails));
  }
  res.statusCode = 200;
  res.end(JSON.stringify(err));
};

const app = new App();

app.use(readBody);
app.get('/tasks', serveTodoLists);
app.get('', serveStaticFile);
app.get('', serveNotFoundPage);
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
app.use(serveBadRequestPage);

module.exports = { app };

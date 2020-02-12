'use strict';

const queryString = require('querystring');
const App = require('./app');
const TodoList = require('./TodoList');
const CONTENT_TYPES = require('./mimeTypes');
const {
  readFile,
  writeTodoLists,
  isFileNotPresent,
  loadTodoLists
} = require('./io');

const STATIC_FOLDER = `${__dirname}/../public`;

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
  const content = readFile(path);
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.setHeader('Content-Length', content.length);
  res.end(content);
};

const todoList = new TodoList(loadTodoLists());

const isValidRequest = function(req, res, params) {
  return params.every(param => {
    return Object.keys(req.body).includes(param);
  });
};

const createTodoList = function(req, res) {
  if (!isValidRequest(req, res, ['title'])) {
    return serveBadRequestPage(req, res);
  }
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
  if (!isValidRequest(req, res, ['id'])) {
    return serveBadRequestPage(req, res);
  }
  const { id } = req.body;
  if (todoList.removeTodo(id)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const addTask = function(req, res) {
  if (!isValidRequest(req, res, ['id', 'work'])) {
    return serveBadRequestPage(req, res);
  }
  const { id, work } = req.body;
  if (todoList.addTask(id, work)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const removeTask = function(req, res) {
  if (!isValidRequest(req, res, ['todoId', 'taskId'])) {
    return serveBadRequestPage(req, res);
  }
  const { todoId, taskId } = req.body;
  if (todoList.removeTask(todoId, taskId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const changeStatusOfTask = function(req, res) {
  if (!isValidRequest(req, res, ['todoId', 'taskId'])) {
    return serveBadRequestPage(req, res);
  }
  const { todoId, taskId } = req.body;
  if (todoList.changeStatus(todoId, taskId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const renameTodo = function(req, res) {
  if (!isValidRequest(req, res, ['newTitle', 'todoId'])) {
    return serveBadRequestPage(req, res);
  }
  const { newTitle, todoId } = req.body;
  if (todoList.renameTodo(newTitle, todoId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const renameTask = function(req, res) {
  if (!isValidRequest(req, res, ['newTitle', 'todoId', 'taskId'])) {
    return serveBadRequestPage(req, res);
  }
  const { newTitle, todoId, taskId } = req.body;
  if (todoList.renameTask(newTitle, todoId, taskId)) {
    return serveTodoLists(req, res);
  }
  return serveNotFoundPage(req, res);
};

const app = new App();

app.use(readBody);
app.get('/tasks', serveTodoLists);
app.get('', serveStaticFile);
app.get('', serveNotFoundPage);
app.post('/createTodo', createTodoList);
app.post('/removeTodo', removeTodoList);
app.post('/createTask', addTask);
app.post('/removeTask', removeTask);
app.post('/changeStatus', changeStatusOfTask);
app.post('/renameTodo', renameTodo);
app.post('/renameTask', renameTask);
app.post('', serveNotFoundPage);
app.use(serveBadRequestPage);

module.exports = { app };

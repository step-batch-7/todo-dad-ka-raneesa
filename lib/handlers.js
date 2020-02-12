'use strict';

const App = require('./app');
const queryString = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
const {
  readFile,
  writeTodoLists,
  isFileNotPresent,
  loadTodoLists
} = require('./io');

const STATIC_FOLDER = `${__dirname}/../public`;
const NUMBER = 1;

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
      <title>Bad Request</title>
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

const todoList = loadTodoLists();

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
  const [lastTask] = todoList.slice(-NUMBER);
  const id = lastTask ? lastTask.id + NUMBER : NUMBER;
  todoList.push({ id, title, tasks: [] });
  serveTodoLists(req, res);
};

const serveTodoLists = function(req, res) {
  writeTodoLists(JSON.stringify(todoList));
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList));
};

const removeTodoList = function(req, res) {
  if (!isValidRequest(req, res, ['id'])) {
    return serveBadRequestPage(req, res);
  }
  const { id } = req.body;
  const todoIndex = todoList.findIndex(task => task.id === +id);
  todoList.splice(todoIndex, NUMBER);
  serveTodoLists(req, res);
};

const addTask = function(req, res) {
  if (!isValidRequest(req, res, ['id', 'work'])) {
    return serveBadRequestPage(req, res);
  }
  const { id, work } = req.body;
  const list = todoList.find(todoList => todoList.id === +id);
  const [lastTask] = list.tasks.slice(-NUMBER);
  const taskId = lastTask ? lastTask.id + NUMBER : NUMBER;
  list.tasks.push({ id: taskId, work, isDone: false });
  serveTodoLists(req, res);
};

const removeTask = function(req, res) {
  if (!isValidRequest(req, res, ['todoId', 'taskId'])) {
    return serveBadRequestPage(req, res);
  }
  const { todoId, taskId } = req.body;
  const list = todoList.find(todoList => todoList.id === +todoId);
  const taskIndex = list.tasks.findIndex(task => task.id === +taskId);
  list.tasks.splice(taskIndex, NUMBER);
  serveTodoLists(req, res);
};

const changeStatusOfTask = function(req, res) {
  if (!isValidRequest(req, res, ['todoId', 'taskId'])) {
    return serveBadRequestPage(req, res);
  }
  const { todoId, taskId } = req.body;
  const list = todoList.find(todoList => todoList.id === +todoId);
  const task = list.tasks.find(task => task.id === +taskId);
  task.isDone = !task.isDone;
  serveTodoLists(req, res);
};

const renameTodo = function(req, res) {
  if (!isValidRequest(req, res, ['newTitle', 'todoId'])) {
    return serveBadRequestPage(req, res);
  }
  const { newTitle, todoId } = req.body;
  const todo = todoList.find(todoList => todoList.id === +todoId);
  todo.title = newTitle;
  serveTodoLists(req, res);
};

const renameTask = function(req, res) {
  if (!isValidRequest(req, res, ['newTitle', 'todoId', 'taskId'])) {
    return serveBadRequestPage(req, res);
  }
  const { newTitle, todoId, taskId } = req.body;
  const list = todoList.find(todoList => todoList.id === +todoId);
  const task = list.tasks.find(task => task.id === +taskId);
  task.work = newTitle;
  serveTodoLists(req, res);
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

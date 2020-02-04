'use strict';

const fs = require('fs');
const App = require('./app');
const queryString = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
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
  res.statusCode = 405;
  res.end(html);

};

const getUrl = function(url) {
  return url === '/' ? '/index.html' : url;
};

const areStatsNotOk = function(stat) {
  return !stat || !stat.isFile();
};

const serveStaticFile = function(req, res, next) {
  const file = getUrl(req.url);
  const path = `${STATIC_FOLDER}${file}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (areStatsNotOk(stat)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const content = fs.readFileSync(path);
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.setHeader('Content-Length', content.length);
  res.end(content);
};

const todoList = [];
const createTodoList = function(req, res) {
  const { title } = req.body;
  const [lastTask] = todoList.slice(-NUMBER);
  const id = lastTask ? lastTask.id + NUMBER : NUMBER;
  todoList.push({ id, title, subTasks: [] });
  res.statusCode = 301;
  res.setHeader('Location', '/');
  res.end();
};

const serveTasks = function(req, res) {
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList));
};

const removeTodoList = function(req, res) {
  const { id } = req.body;
  const todoIndex = todoList.findIndex(task => task.id === +id);
  todoList.splice(todoIndex, NUMBER);
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList));
};

const app = new App();

app.use(readBody);
app.get('/tasks', serveTasks);
app.get('', serveStaticFile);
app.get('', serveNotFoundPage);
app.post('/createTodo', createTodoList);
app.post('/removeTodo', removeTodoList);
app.post('', serveNotFoundPage);
app.use(serveBadRequestPage);

module.exports = { app };

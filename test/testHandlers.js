const fs = require('fs');
const sinon = require('sinon');
const request = require('supertest');
const { app } = require('../lib/handlers');
const CONTENT_TYPES = require('../lib/mimeTypes');

beforeEach(() => sinon.replace(fs, 'writeFileSync', () => { }));
afterEach(() => sinon.restore());

describe('GET', () => {
  it('Should get the index.html for "/" path', (done) => {
    request(app.connectionListener.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/TODO/, done);
  });

  it('should get the index.css for "/css/index.css" path', done => {
    request(app.connectionListener.bind(app))
      .get('/css/index.css')
      .set('accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.css)
      .expect(/body {/, done);
  });
});

describe('GET tasks', function() {
  it('Should respond with all the tasks', function(done) {
    request(app.connectionListener.bind(app))
      .get('/tasks')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/deepika/, done);
  });
});

describe('POST createTodo', function() {
  it('Should save the new todo', function(done) {
    request(app.connectionListener.bind(app))
      .post('/createTodo')
      .send('title=Shankar')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/Shankar/, done);
  });
});

describe('POST removeTodo', function() {
  it('Should remove the todo of given id', function(done) {
    request(app.connectionListener.bind(app))
      .post('/removeTodo')
      .send('id=2')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/deepika/, done);
  });
});

describe('POST createTask', function() {
  it('Should save the new task in given todo id', function(done) {
    request(app.connectionListener.bind(app))
      .post('/createTask')
      .send('id=1&work=noWork')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/noWork/, done);
  });
});

describe('POST removeTask', function() {
  it('Should remove the task of given todo id and task id', function(done) {
    request(app.connectionListener.bind(app))
      .post('/removeTask')
      .send('todoId=1&taskId=2')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/deepika/, done);
  });
});

describe('POST changeStatus', function() {
  it('Should change the status of task of given task,todo id', function(done) {
    request(app.connectionListener.bind(app))
      .post('/changeStatus')
      .send('todoId=1&taskId=1')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/true/, done);
  });
});

describe('POST renameTitle', function() {
  it('Should rename title of given todo id', function(done) {
    request(app.connectionListener.bind(app))
      .post('/renameTitle')
      .send('newTitle=Shankar&todoId=1')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/Shankar/, done);
  });
});

describe('GET nonExisting Url', () => {
  it('should return 404 for a non existing page', (done) => {
    request(app.connectionListener.bind(app))
      .get('/badPage')
      .expect(404, done);
  });
});

describe('PUT nonExisting method', () => {
  it('should return 405 for a non existing method', (done) => {
    request(app.connectionListener.bind(app))
      .put('/')
      .expect(405, done);
  });
});

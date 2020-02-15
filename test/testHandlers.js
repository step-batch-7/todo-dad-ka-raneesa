const fs = require('fs');
const sinon = require('sinon');
const request = require('supertest');
const app = require('../lib/routes');
const CONTENT_TYPES = require('../lib/mimeTypes');

beforeEach(() => sinon.replace(fs, 'writeFileSync', () => { }));
afterEach(() => sinon.restore());

describe('GET', () => {
  it('Should get the index.html for "/" path', (done) => {
    request(app)
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect(/TODO/, done);
  });

  it('should get the index.css for "/css/index.css" path', done => {
    request(app)
      .get('/css/index.css')
      .set('accept', '*/*')
      .expect(200)
      .expect('Content-Type', /text\/css/)
      .expect(/body {/, done);
  });
});

describe('GET tasks', function() {
  it('Should respond with all the tasks', function(done) {
    request(app)
      .get('/tasks')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/deepika/, done);
  });
});

describe('POST createTodo', function() {
  it('Should save the new todo', function(done) {
    request(app)
      .post('/createTodo')
      .set('Accept', '*/*')
      .send('title=Shankar')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/Shankar/, done);
  });

  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/createTodo')
      .set('Accept', '*/*')
      .send('name=Shankar')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });
});

describe('POST removeTodo', function() {
  it('Should remove the todo of given id', function(done) {
    request(app)
      .post('/removeTodo')
      .send('id=2')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/deepika/, done);
  });
  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/removeTodo')
      .set('Accept', '*/*')
      .send('name=Shankar')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });
  it('Should send not found if todo does not exist', function(done) {
    request(app)
      .post('/removeTodo')
      .set('Accept', '*/*')
      .send('id=20')
      .expect(404)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Not Found/, done);
  });
});

describe('POST createTask', function() {
  it('Should save the new task in given todo id', function(done) {
    request(app)
      .post('/createTask')
      .send('id=1&work=noWork')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/noWork/, done);
  });
  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/createTask')
      .set('Accept', '*/*')
      .send('id=1')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });
  it('Should send not found if todo does not exist', function(done) {
    request(app)
      .post('/createTask')
      .set('Accept', '*/*')
      .send('id=20&work=noWork')
      .expect(404)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Not Found/, done);
  });
});

describe.only('POST removeTask', function() {
  it('Should remove the task of given todo id and task id', function(done) {
    request(app)
      .post('/removeTask')
      .send('todoId=1&taskId=2')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=12345')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/deepika/, done);
  });
  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/removeTask')
      .set('Accept', '*/*')
      .send('id=1')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });
  it('Should send not found if todo does not exist', function(done) {
    request(app)
      .post('/removeTask')
      .set('Accept', '*/*')
      .send('todoId=20&taskId=1')
      .expect(404)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Not Found/, done);
  });
  it('Should send not found if task does not exist', function(done) {
    request(app)
      .post('/removeTask')
      .set('Accept', '*/*')
      .send('todoId=1&taskId=10')
      .expect(404)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Not Found/, done);
  });
});

describe('POST changeStatus', function() {
  it('Should change the status of task of given task,todo id', function(done) {
    request(app)
      .post('/changeStatus')
      .send('todoId=1&taskId=1')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/true/, done);
  });
  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/changeStatus')
      .set('Accept', '*/*')
      .send('todoId=1')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });
  it('Should send not found if todo does not exist', function(done) {
    request(app)
      .post('/changeStatus')
      .set('Accept', '*/*')
      .send('todoId=20&taskId=1')
      .expect(404)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Not Found/, done);
  });
  it('Should send not found if task does not exist', function(done) {
    request(app)
      .post('/changeStatus')
      .set('Accept', '*/*')
      .send('todoId=1&taskId=20')
      .expect(404)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Not Found/, done);
  });
});

describe('POST renameTodo', function() {
  it('Should rename todo title of given todo id', function(done) {
    request(app)
      .post('/renameTodo')
      .send('newTitle=Shankar&todoId=1')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/Shankar/, done);
  });
  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/renameTodo')
      .set('Accept', '*/*')
      .send('newTitle=Deepika')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });
  it('Should send not found if todo does not exist', function(done) {
    request(app)
      .post('/renameTodo')
      .set('Accept', '*/*')
      .send('newTitle=changed&todoId=20')
      .expect(404)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Not Found/, done);
  });
});

describe('POST renameTask', function() {
  it('Should rename task of given todo,task id', function(done) {
    request(app)
      .post('/renameTask')
      .send('newTitle=Shankar&todoId=1&taskId=1')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/Shankar/, done);
  });
  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/renameTask')
      .set('Accept', '*/*')
      .send('newTitle=deepika')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });
  it('Should send not found if todo does not exist', function(done) {
    request(app)
      .post('/renameTask')
      .set('Accept', '*/*')
      .send('newTitle=deepika&todoId=20&taskId=1')
      .expect(404)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Not Found/, done);
  });
  it('Should send not found if task does not exist', function(done) {
    request(app)
      .post('/renameTask')
      .set('Accept', '*/*')
      .send('newTitle=deepika&todoId=1&taskId=20')
      .expect(404)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Not Found/, done);
  });
});

describe('POST signup', function() {
  it('Should return login page when all fields are valid', function(done) {
    request(app)
      .post('/signup')
      .set('Accept', '*/*')
      .send('name=shankar&email=sb@gmail.com&username=shankara&password=123456')
      .expect(200)
      .expect(/{}/, done);
  });
  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/signup')
      .set('Accept', '*/*')
      .send('newTitle=deepika')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });
  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/signup')
      .set('Accept', '*/*')
      .send('newTitle=deepika')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });
});

describe('GET nonExisting Url', () => {
  it('should return 404 for a non existing page', (done) => {
    request(app)
      .get('/badPage')
      .expect(404, done)
  });
});

describe('PUT nonExisting method', () => {
  it('should return 405 for a non existing method', (done) => {
    request(app)
      .put('/')
      .expect(405)
      .expect(/Method Not Allowed/, done);
  });
});

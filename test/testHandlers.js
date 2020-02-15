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
      .set('Cookie', 'SID=12345')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect(/TODO/, done);
  });

  it('Should get the signUp.html for "/templates/signUp.html" path', (done) => {
    request(app)
      .get('/signup')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/signUp/, done);
  });

  it('should get the index.css for "/css/index.css" path', done => {
    request(app)
      .get('/css/index.css')
      .set('accept', '*/*')
      .set('Cookie', 'SID=12345')
      .expect(200)
      .expect('Content-Type', /text\/css/)
      .expect(/body {/, done);
  });
});

describe('GET tasks', function() {
  it('Should respond with all the tasks if user is logged in', function(done) {
    request(app)
      .get('/tasks')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=12345')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/deepika/, done);
  });

  it('Should respond 401 unauthorized if user not logged in', function(done) {
    request(app)
      .get('/tasks')
      .set('Accept', '*/*')
      .expect(401, done);
  });
});

describe('POST createTodo', function() {
  it('Should save the new todo', function(done) {
    request(app)
      .post('/createTodo')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=12345')
      .send('title=Shankar')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/Shankar/, done);
  });

  it('Should respond with 401 if user not logged in', function(done) {
    request(app)
      .post('/createTodo')
      .set('Accept', '*/*')
      .send('title=Shankar')
      .expect(401, done);
  });

  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/createTodo')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=12345')
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
      .set('Cookie', 'SID=12345')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/deepika/, done);
  });

  it('Should respond with 401 if user not logged in', function(done) {
    request(app)
      .post('/removeTodo')
      .set('Accept', '*/*')
      .send('id=1')
      .expect(401, done);
  });

  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/removeTodo')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=12345')
      .send('name=Shankar')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });

  it('Should send not found if todo does not exist', function(done) {
    request(app)
      .post('/removeTodo')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=12345')
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
      .set('Cookie', 'SID=12345')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/noWork/, done);
  });

  it('Should respond with 401 if user not logged in', function(done) {
    request(app)
      .post('/createTask')
      .set('Accept', '*/*')
      .send('id=1&work=noWork')
      .expect(401, done);
  });

  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/createTask')
      .set('Accept', '*/*')
      .send('id=1')
      .set('Cookie', 'SID=12345')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });

  it('Should send not found if todo does not exist', function(done) {
    request(app)
      .post('/createTask')
      .set('Accept', '*/*')
      .send('id=20&work=noWork')
      .set('Cookie', 'SID=12345')
      .expect(404)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Not Found/, done);
  });
});

describe('POST removeTask', function() {
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

  it('Should respond with 401 if user not logged in', function(done) {
    request(app)
      .post('/removeTask')
      .set('Accept', '*/*')
      .send('todoId=1&taskId=2')
      .expect(401, done);
  });

  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/removeTask')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=12345')
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
      .set('Cookie', 'SID=12345')
      .expect(404)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Not Found/, done);
  });

  it('Should send not found if task does not exist', function(done) {
    request(app)
      .post('/removeTask')
      .set('Accept', '*/*')
      .send('todoId=1&taskId=10')
      .set('Cookie', 'SID=12345')
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
      .set('Cookie', 'SID=12345')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/deepika/, done);
  });

  it('Should respond with 401 if user not logged in', function(done) {
    request(app)
      .post('/changeStatus')
      .set('Accept', '*/*')
      .send('todoId=1&taskId=1')
      .expect(401, done);
  });

  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/changeStatus')
      .set('Accept', '*/*')
      .send('todoId=1')
      .set('Cookie', 'SID=12345')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });

  it('Should send not found if todo does not exist', function(done) {
    request(app)
      .post('/changeStatus')
      .set('Accept', '*/*')
      .send('todoId=20&taskId=1')
      .set('Cookie', 'SID=12345')
      .expect(404)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Not Found/, done);
  });

  it('Should send not found if task does not exist', function(done) {
    request(app)
      .post('/changeStatus')
      .set('Accept', '*/*')
      .send('todoId=1&taskId=20')
      .set('Cookie', 'SID=12345')
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
      .set('Cookie', 'SID=12345')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/Shankar/, done);
  });

  it('Should respond with 401 if user not logged in', function(done) {
    request(app)
      .post('/renameTodo')
      .set('Accept', '*/*')
      .send('newTitle=Shankar&todoId=1')
      .expect(401, done);
  });

  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/renameTodo')
      .set('Accept', '*/*')
      .send('newTitle=Deepika')
      .set('Cookie', 'SID=12345')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });

  it('Should send not found if todo does not exist', function(done) {
    request(app)
      .post('/renameTodo')
      .set('Accept', '*/*')
      .send('newTitle=changed&todoId=20')
      .set('Cookie', 'SID=12345')
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
      .set('Cookie', 'SID=12345')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.json)
      .expect(/Shankar/, done);
  });

  it('Should respond with 401 if user not logged in', function(done) {
    request(app)
      .post('/renameTask')
      .set('Accept', '*/*')
      .send('newTitle=Shankar&todoId=1&taskId=1')
      .expect(401, done);
  });

  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/renameTask')
      .set('Accept', '*/*')
      .send('newTitle=deepika')
      .set('Cookie', 'SID=12345')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });
  it('Should send not found if todo does not exist', function(done) {
    request(app)
      .post('/renameTask')
      .set('Accept', '*/*')
      .send('newTitle=deepika&todoId=20&taskId=1')
      .set('Cookie', 'SID=12345')
      .expect(404)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Not Found/, done);
  });
  it('Should send not found if task does not exist', function(done) {
    request(app)
      .post('/renameTask')
      .set('Accept', '*/*')
      .send('newTitle=deepika&todoId=1&taskId=20')
      .set('Cookie', 'SID=12345')
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
      .expect(302, done);
  });

  it('Should give error if username is already exits', function(done) {
    request(app)
      .post('/signup')
      .set('Accept', '*/*')
      .send('name=shankar&email=sb@gmail.com&username=deepika&password=123456')
      .expect(200)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Username already exists/, done);
  });

  it('Should give error if email is already exits', function(done) {
    const email = 'karri.b@thoughtworks.com';
    request(app)
      .post('/signup')
      .set('Accept', '*/*')
      .send(`name=shankar&email=${email}&username=shankar&password=123456`)
      .expect(200)
      .expect(/Email already registered/, done);
  });

  it('Should respond with 401 if user not logged in', function(done) {
    request(app)
      .post('/signUp')
      .set('Accept', '*/*')
      .send('name=shankar&email=sb@gmail.com&username=shankara&password=123456')
      .expect(200, done);
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

describe('POST login', function() {
  it('Should return index page when valid credentials given', function(done) {
    request(app)
      .post('/login')
      .set('Accept', '*/*')
      .send('username=deepika&password=deepika')
      .expect(302, done);
  });

  it('Should give error if invalid username given', function(done) {
    request(app)
      .post('/login')
      .set('Accept', '*/*')
      .send('username=shankar&password=deepika')
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(200)
      .expect(/Invalid/, done);
  });

  it('Should give error if invalid username given', function(done) {
    request(app)
      .post('/login')
      .set('Accept', '*/*')
      .send('username=deepika&password=shankar')
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(200)
      .expect(/Invalid/, done);
  });

  it('Should send bad request for invalid request', function(done) {
    request(app)
      .post('/login')
      .set('Accept', '*/*')
      .send('newTitle=deepika')
      .expect(400)
      .expect('Content-Type', CONTENT_TYPES.html)
      .expect(/Bad Request/, done);
  });
});

describe('POST logout', function() {
  it('Should remove the cookie when valid user logout', function(done) {
    request(app)
      .post('/logout')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=12345')
      .send('')
      .expect(302, done);
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

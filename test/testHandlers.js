const request = require('supertest');
const { app } = require('../lib/handlers');

describe('GET Index Page', () => {
  it('Should get the index.html for "/" path', (done) => {
    request(app.connectionListener.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '505')
      .expect(/TODO/, done);
  });

  it('should get the index.css for "/css/index.css" path', done => {
    request(app.connectionListener.bind(app))
      .get('/css/index.css')
      .set('accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css')
      .expect(/body {/, done);
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

const assert = require('assert'),
      request = require('supertest'),
      app = require('../app'),
      logger = require('../services/logger-service'),
      validWebhook = {
        'url': 'https://raguilaru1.free.beeceptor.com',
        'token':'foo'
      },
      validRequestBody = {
        "payload": ["any", { "valid": "JSON" }]
      };


describe('POST /api/webhooks', () =>{
    it('should return 400 when webhook url format is incorrect',
    (done) => {
        request(app)
        .post('/api/webhooks')
        .send({url: 'www.incorrectUrlFormat..', token: 'validToken'})
        .expect('Content-Type', /json/)
        .set('Accept', 'application/json')
        .expect(400)
        .end((err, res) => {
            if (err) return done(err);
            return done();
          });
    });

    it('should return 400 when token is not present',
    (done) => {
        request(app)
        .post('/api/webhooks')
        .send({url: 'www.correctUrlFormat.com', token: ''})
        .expect('Content-Type', /json/)
        .set('Accept', 'application/json')
        .expect(400)
        .end((err, res) => {
            if (err) return done(err);
            return done();
          });
    });

    it('should register a webhook, and respond with a 200 Ok',
    (done) => {
        request(app)
        .post('/api/webhooks')
        .send(validWebhook)
        .expect('Content-Type', /json/)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            return done();
          });
    });

    it('should return response code 422 when trying to register same webhook twice',
    (done) => {
        request(app)
        .post('/api/webhooks')
        .send(validWebhook)
        .expect('Content-Type', /json/)
        .set('Accept', 'application/json')
        .end( () => {
            request(app)
            .post('/api/webhooks')
            .send(validWebhook)
            .set('Accept', 'application/json')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
        });
    });
});

describe('POST /api/webhooks/test', () => {
    it('should return http response code 200',
    (done) => {
        request(app)
        .post('/api/webhooks/test')
        .send(validRequestBody)
        .expect('Content-Type', /json/)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            return done();
        });
    });

    it('should return results if at least one webhook has been registered',
    (done) => {
        request(app)
        .post('/api/webhooks/test')
        .send(validRequestBody)
        .expect('Content-Type', /json/)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            assert.ok(res.body.results.length > 0);
            if (err) return done(err);
            return done();
        });
    });

    it('should return response code 400 if payload property is not valid or absent',
    (done) => {
        request(app)
        .post('/api/webhooks/test')
        .send({})
        .expect('Content-Type', /json/)
        .set('Accept', 'application/json')
        .expect(400)
        .end(function(err, res) {
            if (err) return done(err);
            return done();
        });
    });
});
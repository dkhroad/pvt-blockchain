const request = require('supertest');
const expect = require('chai').expect;


describe('GET /block/:height', function() {
  var server;
  before(()=> {
    server = require('../../app');
  });
  it('get a block at height 0', (done) => {
    request(server.app).get('/block/0')
      .expect(200,done);
  });

  after(() => {
    server.stop();
  });

});

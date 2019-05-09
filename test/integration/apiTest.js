const request = require('supertest');
const expect = require('chai').expect;
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const sinon = require('sinon');


describe('GET /block/:height', function() {
  var server;
  before(()=> {
    server = require('../../app');
  });
  it('gets the genesis block (at height 0)', () => {
    return request(server.app).get('/block/0')
      .expect(200)
      .then(res => { 
        expect(res.body).have.property("height",0);
      });
  });

  after(() => {
    server.stop();
  });

});

describe('POST /requestValidation',() => {
  let server;
  let keyPair = bitcoin.ECPair.fromWIF('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss');  
  let privateKey = keyPair.privateKey;
  let address = '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN';
  let clock;
  let fakeTime = 1483228800000;
  before(() => {
    server = require("../../app");
    clock = sinon.useFakeTimers({now: fakeTime}) 
  });

  after(() => {
    server.stop();
    clock.restore();
  });

  it('posts the ownership request', () => {
    let re = new RegExp(`${address}:${fakeTime/1000}:starRegistry`);

    return request(server.app).post('/requestValidation')
      .send({address: address})
      .expect(200)
      .then(res => {
        expect(res.body).to.match(re);
      });
  });
});

describe('POST /submitstar',() => {
  let server;
  let keyPair = bitcoin.ECPair.fromWIF('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss');  
  let privateKey = keyPair.privateKey;
  let address = '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN';
  let fakeTime = 1483228800000;
  let clock;

  before(() => {
    server = require("../../app");
    clock = sinon.useFakeTimers({now: fakeTime});
  });

  after( () => {
    server.stop();
    clock.restore();
  });

  it("submits a star with a valid signature",() => {
    let message = `${address}:${fakeTime/1000}:starRegistry`;
    let star = {
      dec: "68° 52' 56.9",
      ra: "16h 29m 1.0s",
      story: "Tesing the story 4"
    };
    let signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);

    return request(server.app).post('/submitstar')
      .send({
        address: address,
        signature: signature,
        message: message,
        star: {
          dec: "68° 52' 56.9",
          ra: "16h 29m 1.0s",
          story: "Tesing the story 4"
        }
      }).expect(200).then((res) => {
        expect(res.body).to.have.all.keys(["hash","height","body","time","previousBlockHash"])
      });
  });
});

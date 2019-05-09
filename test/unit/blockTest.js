const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const BlockClass = require('../../src/block');
const SHA256 = require('crypto-js/sha256');

describe('validate',function() {
  let block;
  before(() => {
    block = new BlockClass.Block({a: 1, b: 2});
    block.hash = SHA256(
      block.time +
      block.height +
      block.body + 
      block.previousBlockHash
    ).toString();
  });
  it('validates', () => {
    return expect(block.validate()).to.eventually.equal(true);
  });
});

describe('getBData',() => {
  let block,genesis_block;


  describe('For a non-genesis block',() => {
    before(() => {
      block = new BlockClass.Block({a: 1, b: 2});
      block.height = 1;
    });
    it('decodes and returns the block body',() => {
      return expect(block.getBData()).to.eventually.deep.equal({a: 1,b: 2});
    });
  });

  describe('For a genesis block',() => {
    before(() => {
      block = new BlockClass.Block({a: 1, b: 2});
    });

    it('throws an error',() => {
      return expect(block.getBData()).to.eventually.be.rejected.and.be.an.instanceOf(Error);
    });

  });

});

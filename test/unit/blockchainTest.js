const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
chai.use(chaiAsPromised);
const expect = chai.expect;
const bitcoinMessage = require('bitcoinjs-message');
const bitcoin = require('bitcoinjs-lib');
const BlockClass = require('../../src/block');
const BlockchainClass = require('../../src/blockchain');

describe("#submitStar",() => {
  let clock;
  let keyPair = bitcoin.ECPair.fromWIF('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss');  
  let privateKey = keyPair.privateKey;
  let address = '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN';
  let blockChain;

  before(() => {
    clock = sinon.useFakeTimers({now: 1483228800000});
    blockChain = new BlockchainClass.Blockchain();
  });
  after(() => {
    clock.restore();    
  });


  describe("Valid signature",() => {
    describe("Time didn\'t expire",() =>  {
      let star = {
        dec: "68° 52' 56.9",
        ra: "16h 29m 1.0s",
        story: "Tesing the story 4"
      };

      before(() => {
        clock.tick(2000)
      });

      it("submits a star in newly minted block",() => {
        return blockChain.requestMessageOwnershipVerification("1234")
          .then((message) => {
            let signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);
            blockChain.submitStar(address, message, signature,star).then((block) => {
              expect(block).equal(blockChain.chain[blockChain.chain.length - 1]);
              expect(block.getBData()).to.eventually.eql({owner: address,star: star});
            });
          });
      });
    });

    describe("Time did expire", () => {
      before(() => {
      });
      it("Doesn\'t add a new block with star info to the chain ", () => {
        return blockChain.requestMessageOwnershipVerification("1234")
          .then((message) => {
            clock.tick(60*5001);
            let signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);
            expect(blockChain.submitStar(
              address,
              message,
              signature,
              "some shady star info")
            ).to.eventually.rejectedWith(Error, "Time elapsed is more than 5 minutes");
          });
      });
    });
  });

  describe("Invalid signature",() => {
    describe("Time didn\'t expire",() =>  {
      it("Doesn\'t add a new block with star info to the chain ", () => {
        let address = '1CvmB4AvQqzJTyD6FPztGbHdV9kvgbwNN4';
        return blockChain.requestMessageOwnershipVerification("1234")
          .then((message) => {
            let signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);
            expect(blockChain.submitStar(
              address,
              message,
              signature,
              "some shady star info")
            ).to.rejectedWith(Error, "Signature verification failed");
          });
      });
    });
  });
});

describe('#requestMessageOwnershipVerification',() => {
  let clock;
  before(() => {
    clock = sinon.useFakeTimers({now: 1483228800000});
  });
  after(() => {
    clock.restore();    
  })
  it('creates a message to be signed',()=> {
    blockchain = new BlockchainClass.Blockchain();
    return expect(blockchain.requestMessageOwnershipVerification("1234")).to.eventually.equal("1234:1483228800:starRegistry");
  });
});

describe("#_addBlock",() => {
  let block;
  let blockChain;
  beforeEach(()=> {
    block = new BlockClass.Block({data: 'New Block'});
    blockChain = new BlockchainClass.Blockchain();
  });


  it('adds block to the chain',() => {
    return expect(blockChain._addBlock(block)).to.eventually.equal(block);
  });

  it('updates the block height correct',() => {
    expect(blockChain.height).equal(0); 
    return blockChain._addBlock(block).then((block) => {
      expect(block.height).to.equal(1);
      expect(block.previousBlockHash).to.not.equal(null);
      expect(blockChain.height).equal(1);
      expect(blockChain.chain.length).to.equal(2);
    });
  });
});

describe("#getBlockByHash",() => {
  let block;
  let blockChain;
  beforeEach(()=> {
    block = new BlockClass.Block({data: 'New Block'});
    blockChain = new BlockchainClass.Blockchain();
  });

  it("gets the correct block for a given hash",() => {
    return blockChain._addBlock(block).then(blk => {
      expect(blockChain.getBlockByHash(blk.hash)).eventually
          .to.have.property('hash', blk.hash);
    });
  });
});

describe("#getStarsByWalletAddress",() => {
  let star = {
    dec: "68° 52' 56.9",
    ra: "16h 29m 1.0s",
    story: "Tesing the story 4"
  };

  let keyPair = bitcoin.ECPair.fromWIF('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss');  
  let privateKey = keyPair.privateKey;
  let address = '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN';
  let  blockChain; 

  before(() => {
    blockChain = new BlockchainClass.Blockchain();
    return blockChain.requestMessageOwnershipVerification("1234")
      .then((message) => {
        let signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);
        blockChain.submitStar(address, message, signature, star);
      });
  });

  it("returns correct set of stars", () => {
    return blockChain.getStarsByWalletAddress(address).then(stars => {
      expect(stars.length).to.equal(1);
      expect(stars[0]).to.eql({
        owner: address,
        star: {
          dec: "68° 52' 56.9",
          ra: "16h 29m 1.0s",
          story: "Tesing the story 4"
        }
      });
    });
  })
});

describe("#getStarsByWalletAddress",() => {
  let star = {
    dec: "68° 52' 56.9",
    ra: "16h 29m 1.0s",
    story: "Tesing the story 4"
  };

  let keyPair = bitcoin.ECPair.fromWIF('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss');  
  let privateKey = keyPair.privateKey;
  let address = '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN';
  let  blockChain; 

  before(() => {
    blockChain = new BlockchainClass.Blockchain();
    return blockChain.requestMessageOwnershipVerification("1234")
      .then((message) => {
        let signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);
        blockChain.submitStar(address, message, signature, star);
      });
  });

  it("returns correct set of stars", () => {
    return blockChain.getStarsByWalletAddress(address).then(stars => {
      expect(stars.length).to.equal(1);
      expect(stars[0]).to.eql({
        owner: address,
        star: {
          dec: "68° 52' 56.9",
          ra: "16h 29m 1.0s",
          story: "Tesing the story 4"
        }
      });
    });
  })
});


describe("#validateChain",() => {
  let star = {
    dec: "68° 52' 56.9",
    ra: "16h 29m 1.0s",
    story: "Tesing the story 4"
  };

  let keyPair = bitcoin.ECPair.fromWIF('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss');  
  let privateKey = keyPair.privateKey;
  let address = '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN';
  let  blockChain; 

  before(() => {
    blockChain = new BlockchainClass.Blockchain();
    return blockChain.requestMessageOwnershipVerification("1234")
      .then((message) => {
        let signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);
        blockChain.submitStar(address, message, signature, star);
      });
  });

  it("validates a good chain", () => {
    return expect(blockChain.validateChain()).to.eventually.eql([]);
  })
})
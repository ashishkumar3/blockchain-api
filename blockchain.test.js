const Blockchain = require('./blockchain');
const Block = require('./block');

describe('blockchain', () => {
  
  let bc;

  beforeEach(() => {
    bc = new Blockchain();
  });


  it('starts with the genesis block', () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block', () => {
    const data = 'randomdata';
    bc.addBlock(data);

    expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
  });

});
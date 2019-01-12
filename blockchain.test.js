const Blockchain = require("./blockchain");
const Block = require("./block");

describe("blockchain", () => {
  let bc, bc2;

  beforeEach(() => {
    bc = new Blockchain();
    bc2 = new Blockchain();
  });

  it("starts with the genesis block", () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new block", () => {
    const data = "randomdata";
    bc.addBlock(data);

    expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
  });

  it("validates a valid chain", () => {
    bc2.addBlock("bar");
    expect(bc.isValidChain(bc2.chain)).toBe(true);
  });

  it("invalidatesa chain with corrupt genesis block", () => {
    bc2.chain[0].data = "bad data";

    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it("invalidates a corrupt chain", () => {
    bc2.addBlock("foo");
    bc2.chain[1].data = "not foo";
    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it("replaces the blockchain with a new chain", () => {
    bc2.addBlock("yoyo");
    bc.replaceChain(bc2.chain);
    expect(bc.chain).toEqual(bc2.chain);
  });

  it("does not replace the chain if new chain is less than or equal to the blockchain in length", () => {
    bc.addBlock("test block");
    bc.replaceChain(bc2.chain);
    expect(bc.chain).not.toEqual(bc2.chain);
  });
});

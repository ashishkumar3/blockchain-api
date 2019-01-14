const SHA256 = require("crypto-js/sha256");

const DIFFICULTY = 4;

class Block {
  constructor(timestamp, lasthash, hash, data, nonce) {
    this.timestamp = timestamp;
    this.lastHash = lasthash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
  }

  toString() {
    return `Block-
      Timestamp: ${this.timestamp}
      Last Hash: ${this.lastHash.substring(0, 10)}
      Hash:      ${this.hash.substring(0, 10)}
      Nonce:     ${this.nonce}
      Data:      ${this.data}
    `;
  }

  // To start with the first block.
  static genesis() {
    return new this("Genesis Time", "-----", "f1r57-h45h", [], 0);
  }

  static mineBlock(lastBlock, data) {
    let hash, timestamp;
    let nonce = 0;
    const lastHash = lastBlock.hash;

    // increment nonce until we get the nummber of leading zeroes same as DIFFICULTY and find hash for each
    do {
      nonce++;
      timestamp = Date.now();
      hash = Block.hash(timestamp, lastHash, data, nonce);
    } while (hash.substring(0, DIFFICULTY) !== "0".repeat(DIFFICULTY));

    // return the hash which satisfy the nonce
    return new this(timestamp, lastHash, hash, data);
  }

  // create hash for every block created using sha256
  static hash(timestamp, lastHash, data, nonce) {
    return SHA256(`${timestamp}${lastHash}${nonce}${data}`).toString();
  }

  static blockHash(block) {
    const { timestamp, lastHash, data, nonce } = block;

    return Block.hash(timestamp, lastHash, data, nonce);
  }
}

module.exports = Block;

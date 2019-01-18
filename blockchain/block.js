const ChainUtil = require("../chain-util");
const { DIFFICULTY, MINE_RATE } = require("../config");

class Block {
  constructor(timestamp, lasthash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lasthash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block-
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Nonce     : ${this.nonce}
      Difficulty: ${this.difficulty}
      Data      : ${this.data}
    `;
  }

  // To start with the first block.
  static genesis() {
    return new this("Genesis Time", "-----", "f1r57-h45h", [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    let hash, timestamp;
    let nonce = 0;
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;

    // increment nonce until we get the number of leading zeroes same as DIFFICULTY and find hash for each
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    // return the hash which satisfy the nonce
    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  // create hash for every block created using sha256
  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return ChainUtil.hash(
      `${timestamp}${lastHash}${data}${nonce}${difficulty}`
    ).toString();
  }

  static blockHash(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;

    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    difficulty =
      currentTime - lastBlock.timestamp < MINE_RATE
        ? difficulty + 1
        : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block;

const SHA256 = require('crypto-js/sha256');

class Block{
  constructor(timestamp, lasthash, hash, data){
    this.timestamp = timestamp;
    this.lastHash = lasthash;
    this.hash = hash;
    this.data = data;
  }

  toString(){
    return `Block-
      Timestamp: ${this.timestamp}
      Last Hash: ${this.lasthash.substring(0, 10)}
      Hash: ${this.hash.substring(0, 10)}
      Data: ${this.data}
    `;
  }

  // To start with the first block.
  static genesis(){
    return new this('Genesis Time', '-----', 'b31k-3k12b', []);
  }

  static mineBlock(lastBlock, data){
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = Block.hash(timestamp, lastHash, data);
    return new this(timestamp, lastHash, hash, data);
  }

  // create hash for every block created using sha256
  static hash(timestamp, lastHash, data){
    return SHA256(`${timestamp}${lastHash}${data}`).toString();
  }
}

module.exports = Block;
const EC = require("elliptic").ec;
const uuidV1 = require("uuid/v1");
const SHA256 = require("crypto-js/sha256");

const ec = EC("secp256k1");

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static id() {
    return uuidV1();
  }

  static hash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }
}

module.exports = ChainUtil;

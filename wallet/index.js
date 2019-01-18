const { INITIAL_BALANCE } = require("../config");
const ChainUtil = require("../chain-util");

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  toString() {
    return `Wallet -
      Balance    : ${this.balance}
      Public Key : ${this.publicKey}`;
  }

  // we use hash here so that we do not have to sign a very lagre object, instead we use a fixed charqacter hash.
  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }
}

module.exports = Wallet;

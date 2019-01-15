const { INITIAL_BALANCE } = require("../config");

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPaor = null;
    this.publicKey = null;
  }

  toString() {
    return `Wallet -
      Balance    : ${this.balance}
      Public Key : ${this.publicKey}`;
  }
}

module.exports = Wallet;

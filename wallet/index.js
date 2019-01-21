const { INITIAL_BALANCE } = require("../config");
const ChainUtil = require("../chain-util");
const Transaction = require("./transaction");

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

  // we use hash here so that we do not have to sign a very lagre object, instead we use a fixed character hash.
  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  // create a transaction by the current wallet.
  createTransaction(recipient, amount, transactionPool) {
    // check if the amount is not greater than the balance available
    if (amount > this.balance) {
      console.log(
        `Amount ${amount} exceeds the current balance ${
          this.balance
        } in the wallet.`
      );
      return;
    }

    // check if the trasaction already exists
    let transaction = Transaction.existingTransaction(this.publicKey);

    // if yes
    if (transaction) {
      // update the transaction
      transaction.update(this, recipient, amount);
    } else {
      // if no
      // create the new transaction
      transaction = Transaction.newTransaction(this, recipient, amount);
      // add it to the mempool
      transactionPool.updateOrAddTransction(transaction);
    }

    return transaction;
  }
}

module.exports = Wallet;

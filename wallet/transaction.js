const ChainUtil = require("../chain-util");

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  static newTransaction(senderWallet, recepient, amount) {
    const transaction = new this();
    // console.log(transaction);

    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds the balance.`);
      return;
    }

    transaction.outputs.push(
      ...[
        {
          amount: senderWallet.balance - amount,
          address: senderWallet.publicKey
        },
        { amount, address: recepient }
      ]
    );

    return transaction;
  }
}

module.exports = Transaction;

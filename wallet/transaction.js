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

    // everytime a transaction is created we sign it.
    Transaction.signTransaction(transaction, senderWallet);

    return transaction;
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.amount,
      address: senderWallet.publicKey,
      // sigining the outputs array which has all the data related to a particular transaction.
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }
}

module.exports = Transaction;

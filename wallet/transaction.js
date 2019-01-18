const ChainUtil = require("../chain-util");

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(
      output => output.address === senderWallet.publicKey
    );

    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds the balance.`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);
    return this;
  }

  static newTransaction(senderWallet, recipient, amount) {
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
        { amount, address: recipient }
      ]
    );

    // console.log("trnsaction output", transaction.outputs);

    // everytime a transaction is created we sign it.
    Transaction.signTransaction(transaction, senderWallet);

    // if (Transaction.verifyTransaction(transaction, senderWallet)) {
    //   return transaction;
    // } else {
    //   console.log("Data might have been tempered");
    // }
    return transaction;
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      // sigining the outputs array which has all the data related to a particular transaction.
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;

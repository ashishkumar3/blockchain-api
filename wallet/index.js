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
  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain);
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
    let transaction = transactionPool.existingTransaction(this.publicKey);

    // if yes
    if (transaction) {
      // update the transaction
      transaction.update(this, recipient, amount);
    } else {
      // if no
      // create the new transaction
      transaction = Transaction.newTransaction(this, recipient, amount);
      // add it to the mempool
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];
    // For each block in a blockchain, and for each data part(all transactions) in a block we take those transactions and push them in the transactions array.
    blockchain.chain.forEach(block =>
      block.data.forEach(transaction => {
        transactions.push(transaction);
      })
    );

    // now get only those transactions whose address in the input matches the public key of this wallet.
    const walletInputTransactions = transactions.filter(
      transaction => transaction.input.address === this.publicKey
    );

    let startTime = 0;

    // Now we have only those transactions which are made by this current user.
    // we then check for every transaction and return which ever has the highest timestamp so as to get the most recent transaction in the walletInputTransactions array.
    // when we reduce a function, we cannot reduce an array that maybe empty, otherwise it returns undefined.
    // so we wrap it in an if block.
    if (walletInputTransactions.length > 0) {
      const recentInputTransaction = walletInputTransactions.reduce(
        (previous, current) =>
          previous.input.timestamp > current.input.timestamp
            ? previous
            : current
      );
      // now as we got the most recent transaction in the recentInputTransaction variable, we can get its amount
      balance = recentInputTransaction.outputs.find(
        output => output.address === this.publicKey
      ).amount;

      // now to add the rest of the currency of this wallet coming after this transaction
      // all the transactions made for this user ie those amounts which are sent to the current user by other users.
      // these can be found by adding all those transactions' amounts which came after the recentInputTranscation
      startTime = recentInputTransaction.input.timestamp;
    }

    // now we check all those transactions which come after the startTime and matches this public key as the address and add the balance to their amount.
    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime) {
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
    // we have to use this function before every transaction this wallet creates.
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = "blockchain-wallet-address";
    return blockchainWallet;
  }
}

module.exports = Wallet;

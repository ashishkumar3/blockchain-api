const Transaction = require("./transaction");

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  // update or add the transaction to the transaction array i.e. transaction pool
  updateOrAddTransaction(transaction) {
    // check if transaction already exists in the transactions array or not
    let transactionWithId = this.transactions.find(
      t => t.id === transaction.id
    );

    // if it exists
    if (transactionWithId) {
      //transaction exists in the pool, so update it with new incoming transaction
      this.transactions[
        this.transactions.indexOf(transactionWithId)
      ] = transaction;
    } else {
      // transaction does not exist in the pool, add it to the pool
      this.transactions.push(transaction);
    }
  }

  // for checking if a transaction exists
  existingTransaction(address) {
    return this.transactions.find(t => t.input.address === address);
  }

  // return the transaction from the pool if valid
  validTransactions() {
    // take every transaction from the pool and check if
    return this.transactions.filter(transaction => {
      // 1. total output amount is equal to the total input amount
      // this is done to check if a user is not double spending the money
      // we can do this by applying reduce which gives the sum total in each iteration
      const totalOutputAmount = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);

      if (totalOutputAmount !== transaction.input.amount) {
        console.log(`Invalid transaction from ${transaction.input.address}.`);
        return;
      }
      // 2. verify signature for each transaction
      // to check if the transaction was made by the sender or some one other
      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}.`);
        return;
      }

      return transaction;
    });
  }
}

module.exports = TransactionPool;
